const users = require("../../Models/User/userModel");
const jwt = require("jsonwebtoken");
const skills = require("../../Models/SkillModel");
const RatingAndFeedback = require("../../Models/RatingModel");
const bookings = require("../../Models/BookingsModel");
const transcations = require("../../Models/transactionModel");
const Skillcategories=require('../../Models/categoryModel')
const complaintsAndFeedback=require('../../Models/complaintAndFeedbackModel')
const Razorpay=require('razorpay')
const path=require('path')

exports.userRegistration = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const files = req.files; 

    console.log(req.body);
    console.log(req.files);

    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const certifications = files.map((file, index) => ({
      skillName: req.body[`certifications_skillName_${index}`], 
      filePath: `/uploads/${path.basename(file.path)}`, 
    }));

    const newUser = new users({ userName, email, password, certifications });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log(req.body)
    // console.log(process.env.SECRET_KEY)

    const existing = await users.findOne({ email, password });

    if (existing) {
      const token = jwt.sign({ UserId: existing._id }, process.env.SECRET_KEY);
      if (existing.status) {
        status = existing.status;
      } else {
        status = "";
      }

      return res.status(200).json({
        token,
        userName: existing.userName,
        role: existing.role,
        phone:existing.phone,
        email:existing.email,
        status,
        _id: existing._id,
      });
    } else {
      return res.status(404).json("Invalid username or password");
    }
  } catch (err) {
    return res.status(404).json(err);
  }
};

exports.viewUsers = async (req, res) => {
  try {
    const usersList = await users
      .find({ role: "user" })
      .select("userName email profile phone certifications status password role");

    const usersWithSkills = await Promise.all(
      usersList.map(async (user) => {
        const skill = await skills
          .find({ addedBy: user._id })
          .select(
            "skillName description expertise demoVideoURL rate categoryName status"
          );

        return {
          ...user._doc,
          skill, 
        };
      })
    );

    res.status(200).json(usersWithSkills);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      userName,
      email,
      password,
      role,
      currency,
      certifications,
    } = req.body;

    const existing = await users.findOne({ _id: id });

    if (!existing) {
      return res.status(404).json({ message: "User not found" });
    }

    existing.status = status;
    existing.userName = userName;
    existing.email = email;
    existing.password = password;
    existing.role = role;
    existing.currency = currency;
    existing.certifications = certifications;
    existing._id = id;

    await existing.save();

    res.status(200).json(existing);
  } catch (error) {
    console.error("Error updating user status:", error);
    res
      .status(400)
      .json({ message: "Error updating status", error: error.message });
  }
};

exports.viewUserDetails = async (req, res) => {
  try {
    const id = req.payload;
    const userdetails = await users.findOne({ _id: id });
    res.status(200).json({
      userName: userdetails.userName,
      email: userdetails.email,
      phone: userdetails.phone,
      profile: userdetails.profile,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    const id = req.payload;

    if (req.file) {
      var { userName, email, phone } = req.body;
      var profile = req.file.filename;
    } else {
      var { userName, email, phone, profile } = req.body;
    }

    const userdetails = await users.findOne({ _id: id });
    userdetails.userName = userName;
    userdetails.email = email;
    userdetails.phone = phone;
    userdetails.profile = profile;

    await userdetails.save();

    res.status(200).json(userdetails);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.postSkill = async (req, res) => {
  try {
    if (req.file) {
      var demoVideoURL = req.file.filename;
      var {
        skillName,
        description,
        categoryId,
        rate,
        categoryName,
        expertise,
      } = req.body;
      var addedBy = req.payload;
    } else {
      var demoVideoURL = " ";
      var {
        skillName,
        description,
        categoryId,
        rate,
        categoryName,
        expertise,
      } = req.body;
      var addedBy = req.payload;
    }
    const newSkill = new skills({
      skillName,
      description,
      categoryId,
      addedBy,
      demoVideoURL,
      rate,
      categoryName,
      expertise,
    });
    await newSkill.save();
    res.status(200).json(newSkill);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.viewMySkill = async (req, res) => {
  try {
    const id = req.payload;
    const existingSkills = await skills.find({ addedBy: id });

    res.status(200).json(existingSkills);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.editMySkill = async (req, res) => {
  try {
    if (req.file) {
      var {
        _id,
        skillName,
        categoryId,
        categoryName,
        description,
        rate,
        expertise,
      } = req.body;
      var demoVideoURL = req.file.filename;
    } else {
      var {
        _id,
        skillName,
        categoryId,
        categoryName,
        description,
        rate,
        expertise,
        demoVideoURL,
      } = req.body;
    }
    const existingSkill = await skills.findOne({ _id });

    existingSkill.skillName = skillName;
    existingSkill.categoryId = categoryId;
    existingSkill.categoryName = categoryName;
    existingSkill.description = description;
    existingSkill.rate = rate;
    existingSkill.expertise = expertise;
    existingSkill.demoVideoURL = demoVideoURL;

    await existingSkill.save();
    res.status(200).json(existingSkill);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.deleteMySkill = async (req, res) => {
  try {
    const { _id } = req.params;
    const result = await skills.findOneAndDelete({ _id });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.viewSkills = async (req, res) => {
  try {
    const {id} = req.params;
    const SkillList = await skills.find({ categoryId: id });
    res.status(200).json(SkillList);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.getUsersBySkill = async (req, res) => {
  try {
    const { skillname } = req.params;

    const skillsList = await skills.find({ skillName: skillname });

    const userDetails = await Promise.all(
      skillsList.map(async (skill) => {
        const user = await users.findById(skill.addedBy);
        return user ? { ...user._doc, expertise: skill.expertise } : null;
      })
    );

    res.status(200).json(userDetails.filter((user) => user !== null));
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.getMyRatings = async (req, res) => {
  try {
    const id = req.payload;

    const ratings = await RatingAndFeedback.find({ addedTo: id });

    const ratingsWithUsernames = await Promise.all(
      ratings.map(async (rating) => {
        const user = await users.findById(rating.addedBy).select("userName");
        return {
          _id: rating._id,
          skill: rating.skill,
          rating: rating.rating,
          review: rating.review,
          addedBy: user ? user.userName : "Unknown",
          addedTo: rating.addedTo,
          createdAt: rating.createdAt,
        };
      })
    );

    res.status(200).json(ratingsWithUsernames);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error fetching ratings", error });
  }
};


exports.getSpecificUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await users.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const Skills = await skills.find({ addedBy: user._id });

    const ratings = await RatingAndFeedback.find({ addedTo: user._id });

    console.log("Ratings:", ratings);

    const ratingsWithReviewerNames = await Promise.all(
      ratings.map(async (rating) => {
        const reviewer = await users.findOne({ _id: rating.addedBy });
        return {
          rating: rating.rating,
          review: rating.review,
          reviewerName: reviewer.userName, 
          skill: rating.skill,
          reviewerId: reviewer._id,
          id: rating._id,
        };
      })
    );

    const userDetails = {
      user: {
        userName: user.userName,
        email: user.email,
        profilePic: user.profile,
        phone: user.phone,
        userId,
      },
      Skill: Skills.map((skill) => ({
        skillName: skill.skillName,
        description: skill.description,
        rate: skill.rate,
        demoVideoURL: skill.demoVideoURL,
        categoryName: skill.categoryName,
      })),
      ratings: ratingsWithReviewerNames,
    };

    return res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ message: "Error fetching user details" });
  }
};

//rating

exports.addRatingAndFeedback = async (req, res) => {
  try {
    const addedBy = req.payload;
    const { addedTo, rating, review, skill } = req.body;

    const existing = await RatingAndFeedback.findOne({ addedBy, skill });
    if (existing) {
      res.status(406).json("Rating already added");
    } else {
      const newRatingAndFeedBack = new RatingAndFeedback({
        addedBy,
        addedTo,
        rating,
        review,
        skill,
      });
      await newRatingAndFeedBack.save();
      res.status(200).json(newRatingAndFeedBack);
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.updateRatingAndFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review, skill } = req.body;
    const existing = await RatingAndFeedback.findOne({ _id: id });
    if (existing) {
      existing.rating = rating;
      existing.review = review;
      existing.skill = skill;
      await existing.save();
      res.status(200).json(existing);
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.deleteRatingAndFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await RatingAndFeedback.findOneAndDelete({ _id: id });
    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

// bookings

exports.addBooking = async (req, res) => {
  try {
    const { skillName, serviceProviderId } = req.body;
    const userId = req.payload;
    console.log(req.body);

    const existingBooking = await bookings.findOne({
      userId,
      serviceProviderId,
      skillName,
      status: { $nin: ["completed", "cancelled", "rejected"] }, 
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Booking already exists." });
    }

    const newBooking = new bookings({
      userId,
      serviceProviderId,
      skillName,
      status: "pending",
    });

    await newBooking.save();

    return res.status(200).json(newBooking); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.payload; 

    const myBookings = await bookings
      .find({ userId }) 
      .populate("serviceProviderId", "userName phone"); 

    if (myBookings.length > 0) {
      res.status(200).json(myBookings);
    } else {
      res.status(404).json({ message: "No Bookings found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOthersBookings = async (req, res) => {
  try {
    const serviceProviderId = req.payload;

    console.log(serviceProviderId);

    const othersBookings = await bookings
      .find({
        serviceProviderId: serviceProviderId,
      })
      .populate("userId", "userName phone");

    if (othersBookings) {
      res.status(200).json(othersBookings);
    } else {
      res.status(404).json("No Bookings found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { _id, status } = req.body;

    // console.log(req.body)

    const booking = await bookings.findById(_id);

    console.log(booking);

    if (booking) {
      booking.status = status;
      await booking.save();
      res.status(200).json(booking);
    } else {
      res.status(404).json("booking not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};
// payment
exports.getSpecificBookingDetails = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const serviceReceiverId = req.payload;

    const booking = await bookings
      .findById(bookingId)
      .populate("userId serviceProviderId");

    const skill = await skills.findOne({ skillName: booking.skillName });

    const serviceProvider = await users.findById(booking.serviceProviderId);
    const serviceReceiver = await users.findById(serviceReceiverId);

    const response = {
      booking,
      skill,
      serviceProvider,
      serviceReceiver,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addTransactionDetails = async (req, res) => {
  try {
    const {
      serviceProviderId,
      serviceReceiverId,
      skillId,
      bookingId,
      rate,
      serviceProviderName,
      serviceReceiverName,
    } = req.body;

    const updatedBooking = await bookings.findByIdAndUpdate(
      bookingId,
      { status: "completed" },
      { new: true }
    );

    const serviceProvider = await users.findById(serviceProviderId);
    const serviceReceiver = await users.findById(serviceReceiverId);

    serviceProvider.currency += rate;
    serviceReceiver.currency -= rate;

    await serviceProvider.save();
    await serviceReceiver.save();

    const newTransaction = new transcations({
      serviceProviderId,
      serviceReceiverId,
      skillName: updatedBooking.skillName,
      skillId,
      status: "completed",
      transactionDateTime: new Date(),
      serviceProviderName,
      serviceReceiverName,
      rate,
    });

    await newTransaction.save();

    res.status(200).json({
      message: "Transaction completed successfully",
      transaction: newTransaction,
      updatedBalances: {
        serviceProvider: serviceProvider.currency,
        serviceReceiver: serviceReceiver.currency,
      },
    });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.viewAllTransactions = async (req, res) => {
  try {
    const id = req.payload;

    const allTransactions = await transcations.find({
      $or: [{ serviceProviderId: id }, { serviceReceiverId: id }],
    });
    const user = await users.findOne({ _id: id });

    res
      .status(200)
      .json({ transactions: allTransactions, currencyBalance: user.currency });
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// admin
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await skills.find().populate("addedBy", "userName email phone");

    if (!skills || skills.length === 0) {
      return res.status(404).json({ message: "No skills found" });
    }

    const formattedSkills = skills.map((skill) => ({
      skillId: skill._id,
      skillName: skill.skillName,
      expertise: skill.expertise,
      description: skill.description,
      dateSubmitted: skill.createdAt,
      demoVideoURL: skill.demoVideoURL,
      rate: skill.rate,
      categoryName: skill.categoryName,
      user: {
        userId: skill.addedBy?._id || null,
        userName: skill.addedBy?.userName || "Unknown",
        email: skill.addedBy?.email || "No email",
        phone: skill.addedBy?.phone || "No phone",
      },
    }));

    res.status(200).json(formattedSkills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


exports.viewCategories = async (req, res) => {
  try {
    const categories = await Skillcategories.find();

    const categoriesWithUsers = await Promise.all(
      categories.map(async (category) => {
        if (!category._id) return {}; 

        const skill = await skills.find({ categoryId: category._id });

        const userIds = [...new Set(skill.map((s) => s.addedBy?.toString()))];

        const userList = await Promise.all(
          userIds.map(async (userId) => {
            const user = await users.findById(userId).select("userName email profile phone location");

            if (!user) return {};

            const userSkills = skill
              .filter((s) => s.addedBy?.toString() === userId)
              .map((s) => ({
                skillName: s.skillName,
                description: s.description,
                expertise: s.expertise,
                demoVideoURL: s.demoVideoURL,
                rate: s.rate,
                categoryName: s.categoryName,
              }));

            return {
              ...user.toObject(),
              skills: userSkills,
            };
          })
        );

        return {
          categoryId: category._id,
          categoryName: category.categoryName,
          userList,
        };
      })
    );

    res.status(200).json(categoriesWithUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


exports.transactionHistory=async(req,res)=>{
  try {
    
    const allTransactions=await transcations.find()
    res.status(200).json(allTransactions)
  }  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
}


exports.addComplaintOrFeedback = async (req, res) => {

  try {
    console.log(req.body)
    const {  username, type, message, subject, rating } = req.body;
    const userId=req.payload

    if (!userId || !username || !type || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (type === "complaint" && !subject) {
      return res.status(400).json({ error: "Complaint requires a subject" });
    }

    if (type === "feedback" && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: "Feedback requires a valid rating (1-5)" });
    }

    const newEntry = new complaintsAndFeedback({
      userId,
      username,
      type,
      message,
      subject: type === "complaint" ? subject : null,
      rating: type === "feedback" ? rating : null
    });

    await newEntry.save();

    res.status(201).json({ message: `${type} submitted successfully`, data: newEntry });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
    console.log(error)
  }
};

exports.getComplaintsAndFeedback = async (req, res) => {
  try {
    const { type } = req.body; 

    console.log(req.body)

    if (!type) {
      return res.status(400).json({ error: "Type is required (complaint or feedback)." });
    }

    if (type !== "complaint" && type !== "feedback") {
      return res.status(400).json({ error: "Invalid type. Use 'complaint' or 'feedback'." });
    }

    const entries = await complaintsAndFeedback.find({ type }).sort({ createdAt: -1 });

    if (!entries.length) {
      return res.status(404).json({ message: `No ${type}s found.` });
    }

    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching complaints/feedback:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
 
exports.addAdminResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    console.log(req.body)

    if (!response) {
      return res.status(400).json({ error: "Response is required." });
    }

    const entry = await complaintsAndFeedback.findById(id);
    
    if (!entry) {
      return res.status(404).json({ error: "Complaint or feedback not found." });
    }

    entry.adminResponse = response;
    entry.respondedAt = new Date();
    await entry.save();

    res.status(200).json({ message: "Response added successfully.", entry });
  } catch (error) {
    console.error("Error adding admin response:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


exports.purchaseTime=async(req,res)=>{

  try {

    const {amount,currency}=req.body

    const instance = new Razorpay({
      key_id: process.env.Razorpay_API_Key, 
      key_secret: process.env.Razorpay_API_SecretKey,
    });
     const options={
       amount,
       currency
     }
     const order=await instance.orders.create(options)

    res.status(200).json({
      success:true,order
    })
    
  } catch (error) {
    console.error("Error adding admin response:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }

  

}

exports.updateCurrency=async(req,res)=>{
  try {
    const{hours,id}=req.body
    console.log(req.body)
   
    const user=await users.findById(id)
    user.currency+=hours
    await user.save()
    res.status(200).json(user)
  } catch (error) {
    console.error("Error adding admin response:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
 
}