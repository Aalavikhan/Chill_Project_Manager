import { Team } from "../models/teamModel.js";


export const getTeamReports = async (req, res) => {
  try {
    const teams = await Team.aggregate([
      {
        $project: {
          name: 1,
          createdAt: 1,
          updatedAt: 1,
          projectCount: { $size: "$projects" },
          memberCount: { $size: "$members" },
          managerCount: {
            $size: {
              $filter: {
                input: "$members",
                as: "member",
                cond: { $eq: ["$$member.role", "Manager"] }
              }
            }
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    const memberRoleCounts = await Team.aggregate([
      { $unwind: "$members" },
      {
        $group: {
          _id: "$members.role",
          count: { $sum: 1 }
        }
      }
    ]);

    const inactiveTeams = await Team.aggregate([
      {
        $facet: {
          noProjects: [
            { $match: { projects: { $eq: [] } } },
            { $project: { name: 1, createdAt: 1 } }
          ],
          notUpdatedRecently: [
            {
              $match: {
                updatedAt: { $lt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) } // 60 days ago
              }
            },
            { $project: { name: 1, updatedAt: 1 } }
          ]
        }
      }
    ]);

    const avgProjects = await Team.aggregate([
      {
        $group: {
          _id: null,
          avgProjects: { $avg: { $size: "$projects" } }
        }
      }
    ]);

    const topTeamsByMembers = await Team.aggregate([
      {
        $project: {
          name: 1,
          memberCount: { $size: "$members" }
        }
      },
      { $sort: { memberCount: -1 } },
      { $limit: 5 }
    ]);

    const topTeamsByProjects = await Team.aggregate([
      {
        $project: {
          name: 1,
          projectCount: { $size: "$projects" }
        }
      },
      { $sort: { projectCount: -1 } },
      { $limit: 5 }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        teamsOverview: teams,
        memberRoleCounts,
        inactiveTeams: inactiveTeams[0],
        averageProjectsPerTeam: avgProjects[0]?.avgProjects || 0,
        topTeamsByMembers,
        topTeamsByProjects
      }
    });

  } catch (error) {
    console.error("Team Reports Error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate team reports." });
  }
};
