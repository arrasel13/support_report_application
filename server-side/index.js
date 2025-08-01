const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 500;

app.use(cors());
app.use(express.json());

// MongoDB Connection

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.8";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("wpdevDB").collection("users");
    const reportCollection = client.db("wpdevDB").collection("reports");

    // JWT related API
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      console.log("JWT user: ", user);
      console.log("JWT_SECRET: ", process.env.JWT_SECRET);

      if (!user?.email) {
        return res.status(400).send({ message: "Email is required" });
      }

      if (!process.env.JWT_SECRET) {
        return res.status(500).send({ message: "JWT_SECRET not set" });
      }

      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });
      // console.log("token from jwt", token);
      res.send({ token });
    });

    // Middlewares
    const verifyToken = (req, res, next) => {
      const authHeader = req.headers.authorization;

      console.log("from verify token: ", authHeader);

      if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).send({ message: "UnAuthorized Access" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).send({ message: "UnAuthorized Access" });
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "Invalid token" });
        }
        req.decoded = decoded;
        next();
      });
    };

    // use verify admin after verify token
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      const isAdmin = user?.role === "admin" || user?.role === "superadmin";
      if (!isAdmin) {
        return res.status(403).send({ message: "Forbidden Access" });
      }
      next();
    };

    // Find Users
    app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    // Find User as admin/super admin
    app.get("/users/admin/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "Forbidden Access" });
      }
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === "admin" || user?.role === "superadmin";
      }

      res.send({ admin });
    });

    // User Create
    app.post("/users", verifyToken, verifyAdmin, async (req, res) => {
      const user = req.body;
      console.log(user);

      // insert email if user doesn't exists
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "User Already exists", insertedId: null });
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Get All Report infos
    app.get("/reports", verifyToken, async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }

      const user = await userCollection.findOne(query);
      if (!user) {
        return res.status(400).send({ message: "User Not Found" });
      }

      const role = user.role;
      let results;

      if (role === "superadmin" || role === "admin") {
        result = await reportCollection.find().toArray();
      } else {
        result = await reportCollection.find(query).toArray();
      }

      res.send(result);
    });

    // Work Report
    app.get("/workreports", verifyToken, async (req, res) => {
      const email = req.query.email;
      console.log("email from server: ", email);
      const result = await reportCollection
        .aggregate([
          // Step 1: Filter by user email
          {
            $match: {
              email: email, // Replace with dynamic email
            },
          },
          // Step 2: Parse report_date into actual date
          {
            $addFields: {
              parsedDate: {
                $dateFromString: {
                  dateString: "$report_date",
                  format: "%d-%m-%Y", // Your date is in "dd-mm-yyyy" format
                },
              },
            },
          },
          // Step 3: Group by month and year
          {
            $group: {
              _id: {
                month: { $month: "$parsedDate" },
                year: { $year: "$parsedDate" },
              },
              name: { $first: "$name" },
              shopify_review_request: {
                $sum: { $toInt: "$shopify_app_review" },
              },
              shopify_review_received: {
                $sum: { $toInt: "$shopify_app_review_get" },
              },
              org_reviews: { $sum: { $toInt: "$wporg_review_get" } },
              wpdev_tickets: { $sum: { $toInt: "$wpdev_ticket_reply" } },
              storeware_tickets: {
                $sum: { $toInt: "$storeware_ticket_reply" },
              },
              xcloud_tickets: { $sum: { $toInt: "$xcloud_ticket_reply" } },
              wpdev_crisp: { $sum: { $toInt: "$wpdev_crisp_reply" } },
              storeware_crisp: { $sum: { $toInt: "$storeware_crisp_reply" } },
              magic_browser_crisp: {
                $sum: {
                  $add: [
                    { $toInt: "$storeware_crisp_magic_browser_reply" },
                    { $toInt: "$wpdev_crisp_magic_browser_reply" },
                    { $toInt: "$xcloud_crisp_magic_browser_reply" },
                  ],
                },
              },
              xcloud_crisp: { $sum: { $toInt: "$xcloud_crisp_reply" } },
              wporg_reply: { $sum: { $toInt: "$wp_org_reply" } },
              facebook: { $sum: { $toInt: "$fb_post_reply" } },
              tickets_closed: { $sum: { $toInt: "$hs_ticket_close" } },
            },
          },
          // Step 4: Optional sorting by year and month
          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1,
            },
          },
        ])
        .toArray();

      res.send(result);
    });

    // Get Single report by Id
    app.get("/reportById", verifyToken, async (req, res) => {
      const id = req.query.id;
      if (!id) {
        return res.status(400).send({ message: "Missing report ID" });
      }

      const report = await reportCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!report) {
        return res.status(404).send({ message: "Report not found" });
      }

      const requesterEmail = req.decoded.email;
      const user = await userCollection.findOne({ email: requesterEmail });

      if (!user) {
        return res.status(401).send({ message: "User not found" });
      }

      const isOwner = requesterEmail === report.email;
      const isAdmin = user.role === "admin" || user.role === "superadmin";

      if (!isOwner && !isAdmin) {
        return res.status(403).send({ message: "Access denied" });
      }

      res.send(report);
    });

    // Get specific (single user) report
    app.get("/reportsbyemail", verifyToken, verifyAdmin, async (req, res) => {
      const email = req.query.email;
      const date = req.query.date;
      console.log("email from server: ", email);
      console.log("date from server: ", date);
      // if (email !== req.decoded.email) {
      //   return res.status(403).send({ message: "Forbidden Access" });
      // }
      const query = { email: email };
      if (date) {
        const regex = new RegExp(`-?${date}$`);
        query.report_date = { $regex: regex };
      }

      const reports = await reportCollection.find(query).toArray();
      res.send(reports);
    });

    // Report add to Database
    app.post("/addreports", verifyToken, async (req, res) => {
      const report = req.body;
      const query = { report_date: report.report_date, email: report.email };
      console.log("Query: ", query);
      const existingReport = await reportCollection.findOne(query);

      if (existingReport) {
        return res.send({
          message: "This date report already added",
          insertedId: null,
        });
      }
      const result = await reportCollection.insertOne(report);
      res.send(result);
    });

    // Update Work Report
    app.patch("/updateworkreport/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const updateinfo = req.body;
      const filter = { _id: new ObjectId(id) };

      const updatedDoc = {
        $set: {
          report_date: updateinfo.report_date,
          wpdev_ticket_reply: updateinfo.wpdev_ticket_reply,
          storeware_ticket_reply: updateinfo.storeware_ticket_reply,
          xcloud_ticket_reply: updateinfo.xcloud_ticket_reply,
          easyjobs_ticket_reply: updateinfo.easyjobs_ticket_reply,
          userback_reply: updateinfo.userback_reply,
          wpdev_crisp_reply: updateinfo.wpdev_crisp_reply,
          wpdev_crisp_magic_browser_reply:
            updateinfo.wpdev_crisp_magic_browser_reply,
          storeware_crisp_reply: updateinfo.storeware_crisp_reply,
          storeware_crisp_magic_browser_reply:
            updateinfo.storeware_crisp_magic_browser_reply,
          xcloud_crisp_reply: updateinfo.xcloud_crisp_reply,
          xcloud_crisp_magic_browser_reply:
            updateinfo.xcloud_crisp_magic_browser_reply,
          wp_org_reply: updateinfo.wp_org_reply,
          fb_post_reply: updateinfo.fb_post_reply,
          github_reply: updateinfo.github_reply,
          client_issue_card_create: updateinfo.client_issue_card_create,
          client_issue_card_followup: updateinfo.client_issue_card_followup,
          hs_ticket_close: updateinfo.hs_ticket_close,
          hs_ticket_followup: updateinfo.hs_ticket_followup,
          bulk_client_email_sent: updateinfo.bulk_client_email_sent,
          shopify_app_review_req_send: updateinfo.shopify_app_review_req_send,
          shopify_app_review_get: updateinfo.shopify_app_review_get,
          shopify_app_review_links: updateinfo.shopify_app_review_links,
          wporg_review_get: updateinfo.wporg_review_get,
          wporg_review_links: updateinfo.wporg_review_links,
          trustpilot_review_get: updateinfo.trustpilot_review_get,
          trustpilot_review_links: updateinfo.trustpilot_review_links,
          hs_ratings: updateinfo.hs_ratings,
          crisp_ratings: updateinfo.crisp_ratings,
          additional_notes: updateinfo.additional_notes,
        },
      };

      const result = await reportCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // Delete Work Report by ID
    app.delete("/deleteReportById", async (req, res) => {
      const id = req.query.id;
      // console.log("Deleted ID: ", id);
      const query = { _id: new ObjectId(id) };
      const result = await reportCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is ready");
});

app.listen(port, (req, res) => {
  console.log(`This service is running on port ${port}`);
});
