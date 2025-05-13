import { User } from "../models/userModel.js";

// get date X months ago
const monthsAgo = (num) => {
  const d = new Date();
  d.setMonth(d.getMonth() - num);
  return d;
};

export const getUserReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const usersByRole = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    const usersWithProfileImage = await User.countDocuments({ profileImage: { $ne: null } });
    const usersWithoutProfileImage = totalUsers - usersWithProfileImage;

    const usersInTeams = await User.countDocuments({ teams: { $exists: true, $not: { $size: 0 } } });
    const usersNotInTeams = totalUsers - usersInTeams;

    const usersInProjects = await User.countDocuments({ projects: { $exists: true, $not: { $size: 0 } } });
    const usersNotInProjects = totalUsers - usersInProjects;

    const orphanedUsers = await User.countDocuments({
      $and: [
        { teams: { $eq: [] } },
        { projects: { $eq: [] } }
      ]
    });

    // Sign-ups over last 6 months
    const signUpsOverTime = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: monthsAgo(6) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    const formattedSignUps = signUpsOverTime.map(({ _id, count }) => ({
      month: `${_id.month}-${_id.year}`,
      count
    }));

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        usersByRole,
        profileImageStats: {
          withProfileImage: usersWithProfileImage,
          withoutProfileImage: usersWithoutProfileImage
        },
        teamStats: {
          inTeams: usersInTeams,
          notInTeams: usersNotInTeams
        },
        projectStats: {
          inProjects: usersInProjects,
          notInProjects: usersNotInProjects
        },
        orphanedUsers,
        signUpsOverTime: formattedSignUps
      }
    });

  } catch (error) {
    console.error("User Reports Error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate user reports." });
  }
};
