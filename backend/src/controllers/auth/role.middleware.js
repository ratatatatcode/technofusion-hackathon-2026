export const roleMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res
                .status(401)
                .json({ message: "Unauthorized. No user found on request." });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden. Requires one of: [${allowedRoles.join(", ")}].`,
            });
        }

        next();
    };
};
