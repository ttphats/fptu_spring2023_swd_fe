import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const POST_TITLES = [
  'Ta chill trong một ngày mùa thu Đà Lạt',
  'Cùng Chíp Ú hẹn hội bạn thân trở lại Sapa vào một ngày hết dịch bạn nhé!',
  'Đã bao lâu rồi chúng ta chưa có dịp ngồi lại bên nhau',
  'Lắng nghe âm thanh của núi rừng, tạm gác lại những vội vã',
  'Chỉ còn lại những câu chuyện nhỏ to của tôi và bạn',
  'Đà Lạt - điểm trốn lý tưởng cho những ai muốn tạm xa phố thị nhộn nhịp',
  'Lên lịch đi Vũng Tàu, xách balo lên và đi thôi nào!',
  'Bạn có đang nhớ những món ngon Hà Nội mỗi độ Thu về?',
  'Chưa bao giờ nhớ Nha Trang như lúc này',
  'Xách xe lên và đi cùng mình thôi',
  'Năm nay có thể mình và bạn có hẹn ở Mũi Né đấy!',
  'Triệu món ngon đang chờ bạn ở Bến Tre',
  'Dịch bện đã được đẩy lùi thì chúng ta lại vi vu nàoooo',
  'Du lịch biển có gì hấp dẫn',
  'Tại sao Tây Ninh đáng để bạn trải nghiệm',
  'Khung cảnh thiên nhhiên cực đẹp cùng với thiên đường ẩm thực',
  'Ở Phú Yên mà cứ ngỡ DUBAI',
  'Khám phá bảo tàng gấu TEDDY Phú Quốc',
  'Đà Lạt đang tím cả một gốc trời',
  'Chỉ có một lần duy nhất trong năm nên ai mê thì đi liền nhé',
  'Lạc chân tới vương quốc hoa Sơn Tra - Nậm Nghiệp, Ngọc Chiến, Sơn La',
  'Đồng chí TLinh lên đồ đi CHECK IN thôiii',
  'Bình Liêu ngày đầu năm mới có gì?',
  'Thưởng thức đặc sản cá suối cuốn lá lốt với cơm nóng trong thời tiết lạnh giá'
];

const posts = [...Array(23)].map((_, index) => ({
  id: faker.datatype.uuid(),
  cover: `/assets/images/trips/trip_${index + 1}.jpg`,
  title: POST_TITLES[index + 1],
  createdAt: faker.date.past(),
  view: faker.datatype.number(),
  comment: faker.datatype.number(),
  share: faker.datatype.number(),
  favorite: faker.datatype.number(),
  author: {
    name: faker.name.fullName(),
    avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  },
}));

export default posts;
