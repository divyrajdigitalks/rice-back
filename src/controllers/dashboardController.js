const Lead = require('../models/Lead');
const Freight = require('../models/Freight');
const Exmill = require('../models/Exmill');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const activeFreight = await Freight.countDocuments();
    const exMillEntries = await Exmill.countDocuments();

    // Calculate Monthly Revenue (Current Month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const currentMonthLeads = await Lead.find({ createdAt: { $gte: startOfMonth } });
    let monthlyRevenue = 0;

    currentMonthLeads.forEach(lead => {
      if (lead.quote) {
        // Assume 20 MT per lead if volume isn't specified, for realistic revenue calculation
        const pricePerMt = parseFloat(lead.quote.cifUsdPerMt) || parseFloat(lead.quote.fobUsdPerMt) || 0;
        monthlyRevenue += pricePerMt * 20;
      }
    });

    // Generate Chart Data (Last 6 Months)
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'short' });

      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

      const leadsInMonth = await Lead.find({ createdAt: { $gte: start, $lte: end } });

      let monthRevenue = 0;
      leadsInMonth.forEach(lead => {
        if (lead.quote) {
          const price = parseFloat(lead.quote.cifUsdPerMt) || parseFloat(lead.quote.fobUsdPerMt) || 0;
          monthRevenue += price * 20;
        }
      });

      chartData.push({
        name: monthName,
        leads: leadsInMonth.length,
        revenue: Math.round(monthRevenue),
      });
    }

    // Generate Recent Activity
    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(4);
    const recentFreights = await Freight.find().sort({ createdAt: -1 }).limit(4);
    const recentExmills = await Exmill.find().sort({ createdAt: -1 }).limit(4);

    let allActivity = [];

    recentLeads.forEach(item => {
      allActivity.push({
        id: `lead-${item._id}`,
        type: 'Lead',
        title: `New Lead: ${item.companyName || item.contactPerson}`,
        date: item.createdAt,
        status: item.status === 'New' ? 'Pending' : 'Active',
      });
    });

    recentFreights.forEach(item => {
      allActivity.push({
        id: `freight-${item._id}`,
        type: 'Freight',
        title: `Updated Rate: ${item.pol} to ${item.pod}`,
        date: item.createdAt,
        status: 'Completed',
      });
    });

    recentExmills.forEach(item => {
      allActivity.push({
        id: `exmill-${item._id}`,
        type: 'ExMill',
        title: `Added: ${item.variety} ${item.form}`,
        date: item.createdAt,
        status: 'Active',
      });
    });

    // Sort all activity by date descending and take top 4
    allActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentActivity = allActivity.slice(0, 4).map(item => {
      // Format date to "X hours ago" or "X days ago" roughly
      const diffHours = Math.abs(new Date() - new Date(item.date)) / 36e5;
      let dateStr = '';
      if (diffHours < 24) {
        dateStr = `${Math.max(1, Math.floor(diffHours))} hours ago`;
      } else {
        dateStr = `${Math.floor(diffHours / 24)} days ago`;
      }
      return { ...item, date: dateStr };
    });

    res.status(200).json({
      success: true,
      data: {
        totalLeads,
        activeFreight,
        exMillEntries,
        monthlyRevenue,
        chartData,
        recentActivity,
      }
    });

  } catch (err) {
    next(err);
  }
};
