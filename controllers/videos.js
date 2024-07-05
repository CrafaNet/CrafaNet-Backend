const Video = require("../models/materials/Video");
const User = require("../models/User");

exports.getUserSpecializedVideos = async (req, res) => { // Kullanıcının ilgilendiği videolardan ilk yüklenmede 10 adet getirir. Aşağı kaydırdıkça istek atılır ön yüzden ve 1'er adet video gönderilir.
  try {
    const user = await User.findOne({ _id: req.body.data.userID })
      .populate("myWatchVideos")
      .populate("clickGoToVideoInShortVideos");
    let videos = []; // Gönderilecek videolar
    let userInterestCategory = []; // Kullanıcının ilgi alanları (shortsdan videosa tıkladığı ve izlediği videoların kategorileri)
    let userSeesVideos = []; // Kullanıcının ekranda kaydırırken gördüğü videolar
    // Kullanıcıya backendden ekranına gönderdiğimiz videolar varsa userSeesVideos dizisine sadece idlerini ekle (tekrar aynı videoları göndermesin diye)
    req.body?.data?.userSeesVideos?.forEach((video) => {
      userSeesVideos.push(video._id);
    });
    // Kullanıcının seçimine veya ilgi alanına göre videoları getir
    if (!req.body?.data?.category) { // Eğer kullanıcı kategori seçti ise
      userInterestCategory.push(req.body.data.category); // Kullanıcının seçtiği kategoriyi userInterestCategory dizisine ekle
    } else { // Eğer kullanıcı kategori seçmedi ise
      // Kullanıcının izlediği ve tıkladığı videolardan kategorileri al ve userInterestCategory dizisine ekle
      user.clickGoToVideoInShortVideos.forEach((video) => {
        userInterestCategory.push(video.category);
      });
      user.myWatchVideos.forEach((video) => {
        userInterestCategory.push(video.category);
      });
    }
    if (userSeesVideos.length == 0) { // Eğer ekran ilk yüklendi ise
      // Kullanıcının izlediği kategorilerde olan videoları getir ve userSeesVideos olanları getirme
      videos = await Video.find({
        category: { $in: userInterestCategory },
        _id: { $nin: userSeesVideos }
      }).limit(10);
    } else { // Eğer ekran ilk yüklenmedi ise
      // Kullanıcının izlediği kategorilerde olan videoları getir ve userSeesVideos olanları getirme
      videos = await Video.find({
        category: { $in: userInterestCategory },
        _id: { $nin: userSeesVideos }
      }).limit(1);
    }
    // gönderilecek yeni videoalrıda userSeesVideos dizisine sadece idlerini ekle
    videos.forEach((video) => {
      userSeesVideos.push(video._id);
    });
    const response = {
      status: 200,
      message: "message_getUserSpecializedVideos_200",
      data: {
        videos: videos,
        userSeesVideos: userSeesVideos
      }
    };
    return res.json(response);
  } catch {
    const response = {
      status: 500,
      message: "message_getUserSpecializedVideos_500"
    };
    return res.json(response);
  }
}

exports.getUserSpecializedCateory = async (req, res) => { // Kullanıcının ilgilendiği kategorileri getirir
  try {
    const user = await User.findOne({ _id: req.body.data.userID })
      .populate("myWatchVideos")
      .populate("clickGoToVideoInShortVideos")
      .populate("likedShortVideos")
      .populate("myShortVideos");
    let userInterestCategory = []; // Kullanıcının ilgi alanları
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
    // Kullanıcının ilgi alanlarını unique yap
    userInterestCategory = [...new Set(userInterestCategory)];
    const response = {
      status: 200,
      message: "message_getUserSpecializedCateory_200",
      data: userInterestCategory
    };
    return res.json(response);
  } catch {
    const response = {
      status: 500,
      message: "message_getUserSpecializedCateory_500"
    };
    return res.json(response);
  }
}

exports.getVideo = async (req, res) => {
  try {
    let video = await Video.findOne({ _id: req.body.data.videoID }); // Id'si verilen videoyu getir
    const user = await User.findOne({ _id: req.body.data.userID }); // Kullanıcıyı getir
    user.myWatchVideos.push(video._id); // Kullanıcının izlediği videolarına ekle
    if (user.myWatchVideos.length > 15) {
      user.myWatchVideos.shift(); // İzlenen videoların sayısı 15'i geçerse, ilk videoyu çıkar
    }
    await user.save(); // Kullanıcıyı kaydet
    const response = {
      status: 200,
      message: "message_getVideo_200",
      data: video
    };
    return res.json(response);
  } catch (error) {
    console.log(err)
    const response = {
      status: 500,
      message: "message_getVideo_500"
    };
    return res.json(response);
  }
}

