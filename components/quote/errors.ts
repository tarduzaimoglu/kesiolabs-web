export const UploadErrors: Record<string, { title: string; message: string }> = {
  FILE_TOO_LARGE: {
    title: "Dosya Boyutu Çok Büyük",
    message:
      "Yüklediğiniz dosya 50 MB sınırını aşmaktadır. Lütfen daha küçük bir dosya ile tekrar deneyin veya WhatsApp üzerinden bizimle iletişime geçin.",
  },
  UNSUPPORTED_FORMAT: {
    title: "Desteklenmeyen Dosya Formatı",
    message:
      "Yalnızca .STL formatındaki dosyalar desteklenmektedir. Lütfen STL formatında bir dosya yükleyiniz.",
  },
  STL_UNREADABLE: {
    title: "Dosya Okunamadı",
    message:
      "Yüklenen STL dosyası okunamadı veya bozuk olabilir. Farklı bir STL dosyası deneyebilir veya WhatsApp üzerinden bizimle iletişime geçebilirsiniz.",
  },
  TOO_COMPLEX: {
    title: "Model İşlenemedi",
    message:
      "Yüklenen model otomatik hesaplama için çok karmaşık olabilir. Bu tür modelleri manuel olarak inceliyoruz. Lütfen WhatsApp üzerinden bizimle iletişime geçin.",
  },
  UPLOAD_FAILED: {
    title: "Yükleme Başarısız",
    message:
      "Dosya yüklenirken bir hata oluştu. İnternet bağlantınızı kontrol edip tekrar deneyin.",
  },
  UNKNOWN: {
    title: "Bir Hata Oluştu",
    message:
      "İşlem sırasında beklenmeyen bir hata oluştu. Lütfen tekrar deneyin veya WhatsApp üzerinden bizimle iletişime geçin.",
  },
};
