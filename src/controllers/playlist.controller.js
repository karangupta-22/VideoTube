import mongoose,{isValidObjectId} from "mongoose";
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createPlaylist = asyncHandler(async(req,res) => {
    const {name, description} = req.body;
    // Tode: create playlist

    // Input validation should be done before any database operations
    if (!name?.trim() || !description?.trim()) {
        throw new ApiError(400, "Name and description are required!")
    }

    // Validate user exists in request
    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized request")
    }

    const playlist = await Playlist.create({
        name: name.trim(),
        description: description.trim(),
        owner: req.user._id,
        videos: [] // Initialize empty videos array
    })

    if (!playlist) {
        throw new ApiError(500, "Failed to create playlist")
    }

    return res
    .status(201) // 201 for resource creation instead of 200
    .json(
        new ApiResponse(
            201,
            playlist,
            "Playlist created successfully"
        )
    )

});

const getUserPlaylists = asyncHandler(async(req,res) => {
    const {userId} = req.params;
    // todo : get user playlist

    if (!userId?.trim() || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }

    const playlists = await Playlist.find({ owner: userId })
        .populate("videos")

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlists,
                "User playlists fetched successfully"
            )
        )
});

const getPlaylistById = asyncHandler(async(req,res) => {
    const {playlistId} = req.params;
    // todo : get playlist by id

    if (!playlistId?.trim() || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    const playlist = await Playlist.findById(playlistId)
    .populate("videos")

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Playlist fetched successfully"
            )
        )


});

const addVideoToPlaylist = asyncHandler(async(req,res) => {
    const {playlistId, videoId} = req.params

    if (!playlistId?.trim() || !videoId?.trim()) {
        throw new ApiError(400, "PlaylistId and VideoId are required!")
    }

    // Check if playlist exists and user owns it
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Unauthorized - You don't own this playlist")
    }

    // Check if video exists
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Check if video is already in playlist
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in playlist")
    }

    // Add video to playlist
    playlist.videos.push(videoId)
    await playlist.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Video added to playlist successfully"
            )
        )


});

const removeVideoFromPlaylist = asyncHandler(async(req,res) => {
    const {playlistId, videoId} = req.params;

    if (!playlistId?.trim() || !videoId?.trim()) {
        throw new ApiError(400, "PlaylistId and VideoId are required!")
    }

    // Check if playlist exists and user owns it
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Unauthorized - You don't own this playlist")
    }

    // Check if video exists in playlist
    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(404, "Video not found in playlist")
    }

    // Remove video from playlist
    playlist.videos = playlist.videos.filter(
        (vid) => vid.toString() !== videoId
    )
    await playlist.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Video removed from playlist successfully"
            )
        )

    
});

const deletePlaylist = asyncHandler(async(req,res) => {
    const {playlistId} = req.params;

    if (!playlistId?.trim() || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    const playlist = await Playlist.findById(playlistId)
    
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Unauthorized - You don't own this playlist")
    }

    await Playlist.findByIdAndDelete(playlistId)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Playlist deleted successfully"
            )
        )

});

const updatePlaylist = asyncHandler(async(req,res) => {
    const {playlistId} = req.params;
    const {name, description} = req.body;

    if (!playlistId?.trim() || !isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    if (!name?.trim() && !description?.trim()) {
        throw new ApiError(400, "At least one field (name or description) is required for update")
    }

    const playlist = await Playlist.findById(playlistId)
    
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "Unauthorized - You don't own this playlist")
    }

    if (name?.trim()) playlist.name = name.trim()
    if (description?.trim()) playlist.description = description.trim()

    await playlist.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Playlist updated successfully"
            )
        )



});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}