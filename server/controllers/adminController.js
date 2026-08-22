const db = require('../config/db');

exports.getStats = async (req, res) => {
    try {
        const [userCount] = await db.query('SELECT COUNT(*) as total FROM users');
        const [tripCount] = await db.query('SELECT COUNT(*) as total FROM trips');
        const [stopCount] = await db.query('SELECT COUNT(*) as total FROM stops');
        const [expenseCount] = await db.query('SELECT SUM(amount) as total_volume FROM expenses');
        
        res.json({
            success: true,
            data: {
                users: userCount[0].total,
                trips: tripCount[0].total,
                stops: stopCount[0].total,
                totalVolume: expenseCount[0].total_volume || 0
            }
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch admin stats' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id, u.name, u.email, u.role, u.created_at,
                (SELECT COUNT(*) FROM trips WHERE user_id = u.id) as trip_count,
                (SELECT COALESCE(SUM(e.amount), 0) 
                 FROM expenses e 
                 JOIN activities a ON e.activity_id = a.id
                 JOIN stops s ON a.stop_id = s.id
                 JOIN trips t ON s.trip_id = t.id
                 WHERE t.user_id = u.id) as total_spent
            FROM users u
            ORDER BY u.created_at DESC
        `;
        const [users] = await db.query(query);
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Admin Users Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const targetId = req.params.id;
        
        // Prevent deleting yourself
        if (parseInt(targetId) === req.user.userId) {
            return res.status(400).json({ success: false, message: "Cannot delete your own admin account." });
        }

        const [result] = await db.query('DELETE FROM users WHERE id = ?', [targetId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Admin Delete User Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const targetId = req.params.id;
        const { role } = req.body;
        
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        
        if (parseInt(targetId) === req.user.userId) {
            return res.status(400).json({ success: false, message: "Cannot change your own role." });
        }

        const [result] = await db.query('UPDATE users SET role = ? WHERE id = ?', [role, targetId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.json({ success: true, message: `User role updated to ${role}` });
    } catch (error) {
        console.error('Admin Update Role Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update role' });
    }
};
