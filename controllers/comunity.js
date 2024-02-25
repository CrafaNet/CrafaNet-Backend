const Comunity = require('../models/Comunity');
const Video = require('../models/materials/Video');
const Comment = require('../models/materials/Comment');
const User = require('../models/User');
const Category = require('../models/materials/Category');

exports.listAllComunities = async (req, res) => {
    try {
        const comunities = await Comunity.find();
        const response = {
            status: 200,
            message: "All comunities are listed.",
            data: comunities
        };
        return response;
    } catch {
        const response = {
            status: 500,
            message: "An error occured while listing comunities."
        };
        return response;
    }
};


exports.userSpecializedCommunities = async (req, res) => {
    try {
        const comunities = await Comunity.find({ actieve: true });
        const user = await User.findOne({ token: req.body.data.token }).populate({ path: 'interestWorkshop', populate: { path: 'categories' } });
        let userComunities = []; // Kullanıcının katıldığı hali hazırdaki topluluklar
        user.interestWorkshop.forEach(comunity => {
            userComunities.push(comunity._id);
        });

        // Her kategorinin topluluk sayısını tutacak bir obje oluştur
        let categoryCount = {};

        // Kullanıcının ilgi gösterdiği kategorileri say ve categoryCount objesine ekle
        userComunities.forEach(comunityId => {
            const comunity = comunities.find(c => c._id === comunityId);
            comunity.categories.forEach(category => {
                categoryCount[category.name] = (categoryCount[category.name] || 0) + 1;
            });
        });

        // Toplulukları kategori sayısına göre sırala
        comunities.sort((a, b) => {
            const aCount = a.categories.reduce((total, category) => total + (categoryCount[category.name] || 0), 0);
            const bCount = b.categories.reduce((total, category) => total + (categoryCount[category.name] || 0), 0);
            return bCount - aCount; // Azalan sıraya göre sırala
        });

        const response = {
            status: 200,
            message: "All comunities are listed.",
            data: comunities
        };
        return response;
    } catch {
        const response = {
            status: 500,
            message: "An error occured while listing comunities."
        };
        return response;
    }
};


exports.createComunity = async (req, res) => {
    try {
        const comunity = await Comunity.create({
            ...req.body.data
        });
        const response = {
            status: 200,
            message: "Comunity is created.",
            data: comunity
        };
        return response;
    } catch {
        const response = {
            status: 500,
            message: "An error occured while creating comunity."
        };
        return response;
    }
};

exports.updateComunity = async (req, res) => {
    try {
        const comunity = await Comunity.findByIdAndUpdate(req.params.id, {
            ...req.body.data
        });
        const response = {
            status: 200,
            message: "Comunity is updated.",
            data: comunity
        };
        return response;
    } catch {
        const response = {
            status: 500,
            message: "An error occured while updating comunity."
        };
        return response;
    }
}

exports.payRegistrationFee = async (req, res) => {
    try {
        console.log(req.body.data)
        console.log("burada stripe ile tek seferlik kayıt ödemesi alınacak atölyeden")
        let payment = true;
        if (payment) {
            const comunity = await Comunity.findByIdAndUpdate(req.body.data.comunityID, {
                actieve: true
            });
            const response = {
                status: 200,
                message: "Registration fee is paid.",
                data: comunity
            };
        } else {
            const response = {
                status: 201,
                message: "Payment failed."
            };
        }
        return response;
    } catch {
        const response = {
            status: 500,
            message: "An error occured while paying registration fee."
        };
        return response;
    }
}

exports.listOfCategories = async (req, res) => {
    try {
        const comunities = await Comunity.find();
        const categories = await Category.find();
        const response = {
            status: 200,
            message: "All categories are listed.",
            data: categories
        };
        return response;
    } catch {
        const response = {
            status: 500,
            message: "An error occured while listing categories."
        };
        return response;
    }
};

exports.joinComunity = async (req, res) => {
    try {
        console.log(req.body.data)
        console.log("burada stripe ile kayıt ücreti kesilecek aylık abonelik şeklinde, otomatik tekrarlanacak. %30 komisyon kesilecek.")
        let payment = true;
        if (payment) {
            const comunity = await Comunity.findByIdAndUpdate(req.body.data.comunityID, {
                $push: {
                    members: req.body.data.userID
                }
            });
            const user = await User.findOne({ _id: req.body.data.userID });
            user.interestWorkshop.push(req.body.data.comunityID);
            user.save();
            const response = {
                status: 200,
                message: "User joined comunity.",
                data: comunity
            };
        } else {
            const response = {
                status: 201,
                message: "Payment failed."
            };
        }
        return response;
    } catch {
        const response = {
            status: 500,
            message: "An error occured while joining comunity."
        };
        return response;
    }
};

exports.leaveComunity = async (req, res) => {
    try {
        console.log('burada stripe ile ilgili kullanıcının ilgili atölyeye aboneliği iptal edilecek')
        let subscrationCancelFee = true;
        if (subscrationCancelFee) {
            const comunity = await Comunity.findOne({ _id: req.body.data.comunityID });
            comunity.members.pull(req.body.data.userID);
            comunity.save();
            const user = await User.findOne({ _id: req.body.data.userID });
            user.interestWorkshop.pull(req.body.data.comunityID);
            user.save();
            const response = {
                status: 200,
                message: "User left comunity."
            };
            return response;
        } else {
            const response = {
                status: 201,
                message: "There was a problem canceling the subscription. Please contact us."
            };
            return response;
        }
    } catch {
        const response = {
            status: 500,
            message: "An error occured while leaving comunity."
        };
        return response;
    }
};

exports.comunitySearch = async (req, res) => {
    try {
        const searchText = req.body.searchText; // Arama metnini al
        const communities = await Comunity.find({
            $or: [
                { name: { $regex: searchText, $options: 'i' } }, // İsimde arama (büyük-küçük harf duyarlı olmadan)
                { category: { $in: searchText, $options: 'i' } } // Kategori dizisinde arama (büyük-küçük harf duyarlı olmadan)
            ]
        });
        const response = {
            status: 200,
            message: "Arama sonuçları listelendi.",
            data: communities
        };
        return response;
    } catch {
        const response = {
            status: 500,
            message: "Arama sonuçları listelenirken bir hata oluştu."
        };
        return response;
    }
};

exports.comunityDetail = async (req, res) => {
    try {
        const comunity = await Comunity.findOne({ _id: req.body.data.id });
        const response = {
            status: 200,
            message: "Comunity is listed.",
            data: comunity
        };
        return response;
    } catch {
        const response = {
            status: 500,
            message: "An error occured while listing comunity."
        };
        return response;
    }
}

exports.comunityMembers = async (req, res) => {
    try {
        const comunity = await Comunity.findOne({ _id: req.body.data.id }).populate('members');
        const response = {
            status: 200,
            message: "Comunity members are listed.",
            data: comunity.members
        };
        return response;
    }
    catch {
        const response = {
            status: 500,
            message: "An error occured while listing comunity members."
        };
        return response;
    }
};

exports.comunityVideos = async (req, res) => {
    try {
        const comunity = await Comunity.findOne({ _id: req.body.data.id }).populate('videos');
        const currentDate = new Date();

        const pastVideos = comunity.videos.filter(video => video.publicationDate < currentDate);
        const futureVideos = comunity.videos.filter(video => video.publicationDate >= currentDate);
        const activeVideos = comunity.videos.filter(video => video.isActive === true);
        const inactiveVideos = comunity.videos.filter(video => video.isActive !== true);
        const activePastVideos = pastVideos.filter(video => video.isActive === true);

        const response = {
            status: 200,
            message: "Topluluk videoları listelendi.",
            data: {
                pastVideos: pastVideos, // Yayınlama tarihi geçmiş videolar
                futureVideos: futureVideos, // Yayınlama tarihi gelecek videolar, daha yayına çıkmamış planlanmış videolar
                activeVideos: activeVideos, // Aktif videolar
                inactiveVideos: inactiveVideos, // Pasif videolar
                activePastVideos: activePastVideos // Aktif ve yayınlanmış videolar
            }
        };

        return response;
    }
    catch (error) {
        const response = {
            status: 500,
            message: "Topluluk videoları listelenirken bir hata oluştu."
        };

        return response;
    }
}



exports.addNewVideo = async (req, res) => {
    try {
        const video = await Video.create({
            ...req.body.data
        });
        const comunity = await Comunity.findOne({ _id: req.body.data.comunityID });
        comunity.videos.push(video._id);
        comunity.save();
        const response = {
            status: 200,
            message: "Video is added to comunity.",
            data: video
        };
    }
    catch {
        const response = {
            status: 500,
            message: "An error occured while adding video to comunity."
        };
        return response;
    }
}

exports.updateVideo = async (req, res) => {
    try {
        const comunity = await Comunity.findOne({ _id: req.body.data.comunityID });
        if (!comunity.videos.includes(req.body.data.videoID)) {
            const response = {
                status: 201,
                message: "This video does not belong to this comunity."
            };
            return response;
        }
        const video = await Video.findByIdAndUpdate(req.body.data.videoID, {
            ...req.body.data
        });
        const response = {
            status: 200,
            message: "Video is updated.",
            data: video
        };
        return response;
    } catch {
        const response = {
            status: 500,
            message: "An error occured while updating video."
        };
        return response;
    }
}

exports.changeStatusVideo = async (req, res) => {
    try {
        const comunity = await Comunity.findOne({ _id: req.body.data.comunityID });
        if (!comunity.videos.includes(req.body.data.videoID)) {
            const response = {
                status: 201,
                message: "This video does not belong to this comunity."
            };
            return response;
        }
        const video = await Video.findByIdAndUpdate(req.body.data.videoID, {
            actieve: req.body.data.status
        });
        const response = {
            status: 200,
            message: "Video status is changed.",
            data: video
        };
        return response;
    }
    catch {
        const response = {
            status: 500,
            message: "An error occured while changing video status."
        };
        return response;
    }
}

exports.addCommentInVideo = async (req, res) => {
    try {
        const video = await Video.findOne({ _id: req.body.data.videoID });
        const comment = await Comment.create({
            ...req.body.data
        });
        video.comments.push(comment._id);
        await video.save();
        comment.user = req.body.userID;
        await comment.save();
        const response = {
            status: 200,
            message: "Comment is added to video.",
            data: comment
        };
        return response;
    }
    catch {
        const response = {
            status: 500,
            message: "An error occured while adding comment to video."
        };
        return response;
    }
}

exports.deleteCommentInVideo = async (req, res) => {
    try {
        const video = await Video.findOne({ _id: req.body.data.videoID });
        const comment = await Comment.findOne({ _id: req.body.data.commentID });
        video.comments.pull(comment._id);
        video.save();
        comment.remove();
        const response = {
            status: 200,
            message: "Comment is deleted from video."
        };
        return response;
    }
    catch {
        const response = {
            status: 500,
            message: "An error occured while deleting comment from video."
        };
        return response;
    }
};

exports.addAnswerInComment = async (req, res) => {
    try {
        const comment = await Comment.findOne({ _id: req.body.data.commentID });
        const answer = await Comment.create({
            ...req.body.data
        });
        comment.answers.push(answer._id);
        comment.save();
        answer.community = req.body.data.comunityID;
        answer.save();
        const response = {
            status: 200,
            message: "Answer is added to comment.",
            data: answer
        };
        return response;
    }
    catch {
        const response = {
            status: 500,
            message: "An error occured while adding answer to comment."
        };
        return response;
    }
};

exports.deleteAnswerInComment = async (req, res) => {
    try {
        const answer = await Comment.findOne({ _id: req.body.data.answerID });
        answer.remove();
        const response = {
            status: 200,
            message: "Answer is deleted from comment."
        };
        return response;
    }
    catch {
        const response = {
            status: 500,
            message: "An error occured while deleting answer from comment."
        };
        return response;
    }
};

exports.userCustomunizedCategories = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.data.userID }).populate({ path: 'interestWorkshop', populate: { path: 'categories' } });
        let categories = [];
        user.interestWorkshop.forEach(comunity => {
            comunity.categories.forEach(category => {
                if (!categories.includes(category)) {
                    categories.push(category);
                }
            });
        });
        if (categories.length < 10) {
            const topCategories = await Category.find().sort({ "community.length": -1 }).limit(10 - categories.length);
            topCategories.forEach(category => { // İlgi alanı 10'dan azsa en popüler kategorilerin 10'a kadar ekler.
                categories.push(category);
            });
        }
        const response = {
            status: 200,
            message: "User's customunized categories are listed.",
            data: categories
        };
        return response;
    }
    catch {
        const response = {
            status: 500,
            message: "An error occured while listing user's customunized categories."
        };
        return response;
    }
}


