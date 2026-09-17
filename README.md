# Plant Care Reminder

Ứng dụng Expo/React Native hỗ trợ người dùng theo dõi lịch tưới cây trong nhà. Đây là bài checkpoint cá nhân Day 01–08; mã nguồn được tổ chức để minh chứng trực tiếp các kỹ năng trong đề bài.

## Chức năng đã triển khai

- Đăng nhập/đăng xuất: phiên được lưu bằng `expo-secure-store`; khi khởi động lại, ứng dụng đọc lại phiên. Đăng xuất xóa phiên bằng `deleteItemAsync`.
- Danh sách cây từ mock API bất đồng bộ qua TanStack Query; có tìm theo tên, lọc theo loài, màn hình trống và nút thử lại khi lỗi.
- Thêm cây, chỉnh sửa cây, màn hình chi tiết động `plant/[id]`, và nút “Đã tưới hôm nay”. Hạn tưới và số cây quá hạn luôn tính từ `lastWatered` + `wateringDays`, không lưu thành một trường dữ liệu.
- Chế độ ngoại tuyến mô phỏng trong Cài đặt: danh sách tải thành công gần nhất được giữ trong AsyncStorage và hiển thị banner. Thay đổi khi ngoại tuyến được ghi vào hàng đợi bền vững, hiển thị số lượng chờ, và chỉ bị xóa sau khi đồng bộ thành công.
- Light/dark scheme dùng duy nhất `src/lib/tokens.ts`; các file khác không chứa mã màu hex. Điều khiển có `accessibilityRole`/`accessibilityLabel` và chiều cao tối thiểu 44.

## Cấu trúc và kế hoạch đã thực hiện

1. Cấu hình Expo SDK 57, TypeScript strict và Expo Router.
2. Tạo mô hình `Plant`, `CareLog`, mock API và kiểm thử hàm ngày tháng.
3. Tạo Zustand store có selectors cho phiên, kết nối, cache và hàng đợi offline; TanStack Query quản lý truy vấn/mutation dữ liệu cây.
4. Hoàn thành các route: `login`, `/`, `plant/new`, `plant/[id]`, `settings`.
5. Rà soát các trạng thái tải/lỗi/trống/nội dung ở các màn hình dùng dữ liệu và trạng thái gửi biểu mẫu; bổ sung retry cho truy vấn/đồng bộ.
6. Cài dependencies, chạy typecheck, lint, test và export web trước khi nộp.

## Chạy từ máy sạch

Yêu cầu Node.js LTS và npm.

```powershell
npm install
npm run start
```

Sau đó quét QR bằng Expo Go, hoặc dùng `npm run android`, `npm run ios`, hay `npm run web` nếu môi trường đã có emulator/trình duyệt tương ứng.

## Kiểm tra chất lượng

```powershell
npm run typecheck
npm run lint
npm test
```

Kiểm thử tự động hiện có kiểm tra công thức tính hạn tưới/quá hạn tại `tests/dates.test.ts`.

Kết quả xác minh cục bộ ngày 17/09/2026:

- `npx expo export --platform web`: thành công, tạo thư mục `dist`.
- `npm run typecheck`: thành công.
- `npm run lint`: thành công.
- `npm test`: 1/1 kiểm thử thành công.
- `npx expo install --check`: dependencies khớp Expo SDK 57.

## Cập nhật UI UX hiện đại

- Dashboard mới có hero card, thống kê cây cần tưới/đang ổn/tổng số cây, chip lọc, tìm kiếm và thẻ cây có trạng thái deadline.
- Các màn hình đăng nhập, thêm cây, chi tiết cây và cài đặt dùng cùng visual language: thẻ bo góc, hierarchy rõ, trạng thái offline/đồng bộ dễ nhận biết và phản hồi nhấn nút.
- Hiệu ứng `Animated` native tạo fade/translate entrance cho dashboard, card và form; nút có phản hồi scale khi nhấn. Hook `useReducedMotion` tắt motion khi thiết bị bật Reduce Motion.
- Màu mới vẫn chỉ khai báo tại `src/lib/tokens.ts`; không có mã hex màu tại component/screen.

### Kiểm tra UI thủ công sau cập nhật

1. Chạy `npm start`, quét QR bằng Expo Go SDK 57 rồi đăng nhập.
2. Kiểm tra hero dashboard, thẻ thống kê, filter chip, hiệu ứng xuất hiện và phản hồi nhấn nút.
3. Mở một cây, thử tưới/chỉnh sửa; sau đó thêm cây và vào Cài đặt để kiểm tra offline/sync.
4. Bật Reduce Motion trong cài đặt accessibility của thiết bị để xác nhận animation không còn chạy.

Lần build web mới nhất thành công. Giao diện chưa được kiểm tra trực quan bằng browser automation vì workspace hiện không có browser surface; cần thực hiện các bước kiểm tra trên Expo Go hoặc browser của người học.

## Cập nhật responsive sau kiểm tra trên iPhone 14 Pro

Các ảnh runtime cho thấy nội dung trước đây đi vào vùng status bar/notch, dashboard quá dày ở phần filter và thẻ cây chưa tối ưu khi màn hình hẹp. Bản cập nhật sửa các điểm này bằng:

- `SafeAreaProvider` và `SafeAreaView` cho toàn bộ route, tránh Dynamic Island/notch trên iPhone và system bar trên Android.
- Hook `useResponsiveLayout` dùng `useWindowDimensions`/`fontScale`: giảm padding/hero/card trên máy hẹp, tăng lề trên máy rộng và tự xếp dọc grid thông tin khi màn hình hoặc chữ không đủ chỗ.
- Chip lọc loài chuyển thành cuộn ngang; không còn ép nhiều chip dài thành hai hàng.
- Form login/thêm/sửa cây dùng `KeyboardAvoidingView` và `ScrollView` để keyboard không che input/nút.
- Plant card bỏ chiều cao cố định, dùng text truncation hợp lý và trạng thái deadline đặt độc lập để không ép vỡ nội dung.

Nút bánh răng xanh nổi trong ảnh không thuộc UI source hiện tại (nút Cài đặt của app là ô xanh nhạt nhỏ trong dashboard). Nó có thể là overlay từ Expo/dev environment, accessibility hoặc tiện ích thiết bị; cần tắt/ẩn overlay khi kiểm tra UI và không dùng nó làm cơ sở chỉnh layout.

Đã chạy lại: `npm run typecheck`, `npm run lint`, `npm test`, `npx expo install --check` và `npx expo export --platform web` đều thành công.

## Hướng dẫn kiểm thử thủ công

1. Đăng nhập bằng email hợp lệ, tắt và mở lại ứng dụng để kiểm tra session còn tồn tại.
2. Vào Cài đặt, bấm Đăng xuất, mở lại ứng dụng để xác nhận phải đăng nhập lại.
3. Ở danh sách, tìm “Monstera”, thử lọc theo loài, mở một cây, bấm “Đã tưới hôm nay” và quan sát hạn tưới đổi ngay.
4. Vào Cài đặt, chuyển sang ngoại tuyến, sửa hoặc thêm cây. Banner và số thay đổi chờ phải xuất hiện. Chuyển trực tuyến, bấm Đồng bộ thay đổi để xóa hàng đợi.
5. Đổi light/dark scheme của thiết bị để rà soát độ đọc được và thử VoiceOver/TalkBack với các nhãn điều khiển.

## Ghi chú trung thực về phạm vi

Mock API được dùng theo lựa chọn “remote (or mock) API” của đề bài, không phải backend đã triển khai. Git history “nhiều hơn một ngày” là yêu cầu quy trình: dự án có thể được khởi tạo Git hôm nay, nhưng không được tạo commit lùi ngày để giả mạo lịch sử; người học cần tiếp tục commit các thay đổi thật ở những ngày học tiếp theo trước lúc nộp.

## Sửa lỗi hiển thị form Thêm cây

Từ ảnh kiểm tra trên iPhone, nội dung thẻ gợi ý từng bị tràn ngang vì phần chữ nằm cùng hàng với emoji nhưng không có vùng co giãn. Thẻ này hiện dùng một vùng nội dung `flex: 1` với `minWidth: 0`, `flexShrink` và `lineHeight` rõ ràng. Vì vậy chữ sẽ tự xuống dòng trong thẻ thay vì vươn ra mép phải, trên iPhone, Android, màn hình hẹp và khi người dùng tăng cỡ chữ hệ thống.
