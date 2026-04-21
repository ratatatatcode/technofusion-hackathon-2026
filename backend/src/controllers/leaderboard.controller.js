export const updateLeaderboard = (req, res) => {
    try {
        // Function that updates the leaderboards
        // code here...

        return res.status(201).json({ success: true, message: "Created successfully"  });
    } catch(err) {
        console.log(`Error updating the leaderboards ${err}`)
        return res.status(500).json({ success: true, message: "Failed to update the leaderboards" });
    }
}