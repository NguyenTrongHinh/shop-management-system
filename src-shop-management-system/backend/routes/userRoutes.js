import express from "express";
import auth, { isAdmin } from "../middlewares/auth.js";
import {
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();


router.route("/me")
  .get(auth, getUserProfile)    // GET /api/users/me
  .put(auth, updateUserProfile); // PUT /api/users/me

router.route("/")
  .get(auth, isAdmin, getUsers); // GET /api/users

router.route("/:id")
  .get(auth, isAdmin, getUserById)    // GET /api/users/:id
  .put(auth, isAdmin, updateUser)     // PUT /api/users/:id  
  .delete(auth, isAdmin, deleteUser); // DELETE /api/users/:id

export default router;