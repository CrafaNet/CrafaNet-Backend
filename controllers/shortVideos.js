const ShortVideo = require('../models/materials/ShortVideo');
const User = require('../models/User');

exports.getUserSpecializedShortVideos = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.data.userID })
            .populate("myWatchVideos")
            .populate("clickGoToVideoInShortVideos")
            .populate("likedShortVideos")
            .populate("myShortVideos");
        let userSeesVideos = []; // Kullanıcının izlediği videolar
        let userInterestCategory = []; // Kullanıcının ilgi alanları
        let shortVideos = []; // Kullanıcının ilgilendiği kısa videolar
        req.body?.data?.shortVideos?.forEach((video) => {
            shortVideos.push(video);
        });
        user.clickGoToVideoInShortVideos.forEach((video) => {
            userInterestCategory.push(video.category);
        });
        user.myWatchVideos.forEach((video) => {
            userInterestCategory.push(video.category);
        });
        user.likedShortVideos.forEach((video) => {
            userInterestCategory.push(video.category);
        });
        user.myShortVideos.forEach((video) => {
            userInterestCategory.push(video.category);
        });
        // Kullanıcının ilgi alanına göre kısa videoları getir
        if (userSeesVideos.length == 0) {
            shortVideos = await ShortVideo.find({
                category: { $in: userInterestCategory },
                _id: { $nin: userSeesVideos }
            }).limit(3);
        } else {
            shortVideos = await ShortVideo.find({
                category: { $in: userInterestCategory },
                _id: { $nin: userSeesVideos }
            }).limit(1);
        }
        const response = {
            status: 200,
            message: "message_getUserSpecializedShortVideos_200",
            data: {
                shortVideos: shortVideos,
                userSeesVideos: userSeesVideos
            }
        };
        return res.json(response);
    } catch (err) {
        console.log(err)
        const response = {
            status: 500,
            message: "message_getUserSpecializedShortVideos_500"
        };
        return res.json(response);
    }
}

exports.likeShortVideos = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.data.userID });
        const shortVideo = await ShortVideo.findOne({ _id: req.body.data.shortVideoID });
        if (user.likedShortVideos.includes(shortVideo._id)) {
            // Kullanıcının beğendiği kısa videolardan kaldır
            user.likedShortVideos = user.likedShortVideos.filter(video => video != shortVideo._id);
            await user.save();
        } else {
            // Kullanıcının beğendiği kısa videoları kaydet
            user.likedShortVideos.push(shortVideo);
            // Beğenilen kısa videoların sayısı 100'ü geçerse, ilk videoyu çıkar
            if (user.likedShortVideos.length > 100) {
                user.likedShortVideos.shift();
            }
            await user.save();
        }
        const response = {
            status: 200,
            message: "message_likeShortVideos_200"
        };
        return res.json(response);
    } catch (err) {
        console.log(err)
        const response = {
            status: 500,
            message: "message_likeShortVideos_500"
        };
        return res.json(response);
    }
}

exports.clickGoToVideoInShortVideos = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.data.userID });
        const shortVideo = await ShortVideo.findOne({ _id: req.body.data.shortVideoID });
        user.clickGoToVideoInShortVideos.push(shortVideo);
        if (user.clickGoToVideoInShortVideos.length > 15) {
            user.clickGoToVideoInShortVideos.shift();
        }
        await user.save();
        const response = {
            status: 200,
            message: "message_clickGoToVideoInShortVideos_200",
            data: {
                goVideo: shortVideo.video // Short videodan kullancının tıkladığı orjinal videoya git
            }
        };
        return res.json(response);
    }
    catch (err) {
        console.log(err)
        const response = {
            status: 500,
            message: "message_clickGoToVideoInShortVideos_500"
        };
        return res.json(response);
    }
}

exports.saveShortVideo = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.data.userID });
        const shortVideo = await ShortVideo.findOne({ _id: req.body.data.shortVideoID });
        // Kullanıcının kaydettiği kısa videoları kaydet
        user.saveShortVideo.push(shortVideo);
        // Kaydedilen kısa videoların sayısı 20'yi geçerse, ilk videoyu çıkar
        if (user.saveShortVideo.length > 20) {
            user.saveShortVideo.shift();
        }
        await user.save();
        const response = {
            status: 200,
            message: "message_saveShortVideo_200"
        };
        return res.json(response);
    }
    catch (err) {
        console.log(err)
        const response = {
            status: 500,
            message: "message_saveShortVideo_500"
        };
        return res.json(response);
    }
}