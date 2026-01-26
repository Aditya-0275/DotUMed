import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;
    if (
        [fullName, email, username, password].some(
            field => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "Full name is required");
    }
    const exiatedUser = await User.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (exiatedUser) {
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    const coverImageUrl = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatarUrl) {
        throw new ApiError(400, "Avatar upload failed");
    }


    const user = await User.create({
        fullName,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password,
        avatar: avatarUrl.url,
        coverImage: coverImageUrl?.url || ""
    })

    const newUser = await User.findById(user._id).select(
        "-password -createdAt -updatedAt -refreshToken"
    )

    if (!newUser) {
        throw new ApiError(500, "User registration failed");
    }

    res.status(201)
        .json(
            new ApiResponse(201, newUser, "User registered successfully")
        );
});

export { registerUser };

