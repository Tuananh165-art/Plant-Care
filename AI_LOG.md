# AI_LOG

## Bối cảnh

- Bài tập: Individual Skills Checkpoint Day 01–08 – Plant Care Reminder.
- Người thực hiện: 1923051085 Hoang Minh Tuan Anh.
- Mục tiêu: xây dựng ứng dụng Expo TypeScript theo đúng checklist đề bài và lưu lại việc sử dụng AI một cách trung thực.

## Những gì đã yêu cầu AI

1. Đọc, trích xuất và phân tích toàn bộ yêu cầu trong file DOCX.
2. Lập kế hoạch triển khai theo thứ tự: cấu hình dự án, mô hình dữ liệu/API, state, route/giao diện, offline/accessibility, kiểm thử và tài liệu.
3. Tạo mã nguồn Expo Router TypeScript cho ứng dụng nhắc chăm sóc cây; dùng Zustand, TanStack Query, SecureStore, AsyncStorage và mock API.
4. Viết README tiếng Việt, kiểm tra build/typecheck/lint/test và nêu rõ giới hạn chưa thể xác minh.

## Những đề xuất đã chấp nhận

- Dùng mock API bất đồng bộ vì đề bài cho phép “remote (or mock) API”.
- Dùng mock trạng thái online/offline tại màn hình Cài đặt để kiểm tra deterministically cache và hàng đợi thay đổi offline mà không cần ngắt Internet thiết bị.
- Dùng hàm thuần `nextDueDate`/`isOverdue` và một automated test: tránh lưu số cây quá hạn hoặc ngày đến hạn, đúng yêu cầu dữ liệu dẫn xuất.
- Dùng token màu duy nhất để không lặp hex màu giữa các component và hỗ trợ cả light/dark.
- Dùng SecureStore chỉ cho session; cache danh sách/hàng đợi không phải secret nên đặt ở AsyncStorage.

## Những đề xuất đã từ chối hoặc không làm

- Không tạo fake API backend, tài khoản thật hoặc secret: không cần thiết cho checkpoint và không được đưa credential vào mã nguồn.
- Không tạo commit có ngày lùi để giả vờ lịch sử Git trải qua nhiều ngày. Đây là yêu cầu hành vi học tập cần được thực hiện thật bởi người học.
- Không khẳng định app đã chạy trên Android/iOS/web trước khi các lệnh và kiểm tra UI thực tế hoàn tất.

## Kết quả kiểm tra đã thực hiện ngày 17/09/2026

- `npx expo export --platform web`: thành công, Metro bundle hoàn tất và xuất `dist`.
- `npm run typecheck`: thành công, không có lỗi TypeScript.
- `npm run lint`: thành công, không có lỗi lint.
- `npm test`: thành công, 1 test passed/0 failed.
- `npx expo install --check`: dependencies are up to date cho Expo SDK 57.

Lần export web đầu tiên báo thiếu `react-native-web`. AI đã đề nghị thêm dependency chuẩn bằng `npx expo install react-native-web`; sau khi chấp nhận và cài package tương thích, export web thành công. Một lỗi type literal ở token theme và một lint cảnh báo cập nhật state trong effect cũng đã được sửa trước lượt kiểm tra xanh cuối cùng.

## Cập nhật UI UX ngày 17/09/2026

### Yêu cầu đã hỏi AI

Người học yêu cầu brainstorm, lập kế hoạch và cập nhật giao diện Plant Care Reminder theo hướng hiện đại, sinh động hơn, có animation/effect, nhưng không bổ sung backend vì mock API đã đáp ứng đề bài.

### Phương án đã chấp nhận

- Dùng `Animated` và `AccessibilityInfo` có sẵn trong React Native thay vì thêm thư viện animation mới. Lý do: giảm dependency, tương thích Expo Go SDK 57 và vẫn có fade/translate entrance cùng feedback scale khi bấm nút.
- Tôn trọng thiết lập Reduce Motion bằng hook `useReducedMotion`; khi người dùng bật tùy chọn này, animation entrance được hiển thị ngay.
- Thiết kế lại đồng bộ các màn hình dashboard, login, thêm cây, chi tiết cây và cài đặt; giữ nguyên route, mock API, Zustand, TanStack Query, SecureStore và hàng đợi offline.
- Mở rộng token semantic trong `src/lib/tokens.ts` cho card, accent, trạng thái success/danger/warning và shadow. Không đặt hex màu ngoài token file.

### Kiểm tra sau cập nhật

- `npm run typecheck`: thành công.
- `npm run lint`: thành công.
- `npm test`: 1 passed / 0 failed.
- `npx expo install --check`: dependencies are up to date cho Expo SDK 57.
- `npx expo export --platform web`: thành công, tạo lại `dist`.

Build xác minh bundle và mã nguồn nhưng không thay thế kiểm tra trực quan trên Expo Go/browser. Workspace không có browser surface cho automation ở lượt này; người học cần kiểm tra theo checklist README.

## Sửa responsive từ ảnh runtime ngày 17/09/2026

Người học cung cấp sáu ảnh chạy thật trên iPhone 14 Pro và yêu cầu review/chỉnh bố cục đáp ứng trên iPhone lẫn Android. Quan sát chấp nhận được từ ảnh: status bar đè phần hero do chưa dùng Safe Area; dashboard quá dày với chip filter dài; thẻ cây/form cần có đường thoát khi màn hình hẹp, font lớn hoặc keyboard bật.

AI đã áp dụng `SafeAreaProvider`, `SafeAreaView`, `useResponsiveLayout` dựa trên `useWindowDimensions`/`fontScale`, horizontal ScrollView cho chip, KeyboardAvoidingView cho form và layout stack cho grid detail. Không chỉnh code để tránh nút bánh răng xanh vì nó không được render từ source app; có thể là overlay Expo/dev environment, accessibility hoặc tiện ích thiết bị.

Kiểm tra sau thay đổi: `npm run typecheck`, `npm run lint`, `npm test` (1 passed), `npx expo install --check` và `npx expo export --platform web` đều thành công. Cần quét QR lại trên thiết bị để xác minh trực quan Safe Area, font size lớn, keyboard và landscape trên thiết bị thật.

## Sửa lỗi tràn chữ form Thêm cây ngày 17/09/2026

Ảnh kiểm tra mới trên iPhone cho thấy câu gợi ý của form Thêm cây bị tràn sang phải. Nguyên nhân là layout hàng ngang chứa emoji và `Text`, nhưng phần `Text` không có phần tử bọc được phép co lại theo chiều ngang. AI đã thay vùng này bằng `tipCopy` (`flex: 1`, `minWidth: 0`) và `tipText` (`flexShrink: 1`, `lineHeight: 23`), đồng thời rút gọn câu gợi ý mà không thay đổi ý nghĩa. Đây là điều chỉnh layout responsive; không thay đổi dữ liệu, route hay hành vi lưu cây.

## Sửa chữ hero quá nhỏ ở màn hình đăng nhập ngày 17/09/2026

Ảnh runtime iPhone cho thấy “Chăm cây / nhẹ nhàng hơn” hiển thị rất nhỏ trong hero đăng nhập. AI xác định nguyên nhân là `adjustsFontSizeToFit` cùng `numberOfLines={2}` đã buộc React Native giảm font để thỏa điều kiện layout. Hai thuộc tính được loại bỏ; thay bằng `brandCopy` co giãn (`flex: 1`, `minWidth: 0`), cỡ chữ responsive 25–29 và `lineHeight: 35`. Không giới hạn số dòng nên nội dung vẫn đọc được khi người dùng tăng cỡ chữ hệ thống.

## Cách tự rà soát trước khi nộp

Chạy `npm install`, `npm run typecheck`, `npm run lint`, `npm test`; sau đó chạy ứng dụng và làm theo phần “Hướng dẫn kiểm thử thủ công” trong README. Khi hoàn tất, thêm các commit Git thật theo tiến độ làm việc, không bao gồm `node_modules`, rồi nộp mã nguồn cùng README và AI_LOG.
