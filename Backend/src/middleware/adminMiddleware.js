exports.isAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    
    // Check if user is an admin (you can add this field manually in the database)
    if (!user.isAdmin) {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};