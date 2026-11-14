/** Sample inputs for the two demos (made-up names and numbers, for illustration only). */

export const orderSamples = {
  vi: [
    "Chị Lan 0912345678 lấy 2 hộp bánh quy, 1 chai nước mắm",
    "0987 654 321 - anh Tuấn đặt 3 kg cà phê",
    "Em Hoa ơi cho chị 5 gói mì và 2 lon nước ngọt nhé, sđt 0356.123.789",
    "Ship giúp mình 1 thùng sữa nhé",
    "Bác Minh 090123 lấy 2 hũ mật ong",
    "Anh Nam 0901234567 hỏi giá thôi",
  ].join("\n"),
  en: [
    "Anna 0912345678 wants 2 boxes of cookies, 1 bottle of fish sauce",
    "0987 654 321 - Tom orders 3 kg coffee",
    "Hi, it's Mai, 5 packs of noodles and 2 cans of soda please, phone 0356.123.789",
    "Please ship 1 carton of milk",
    "Ben 090123 needs 2 jars of honey",
    "Sam 0901234567 just asking about prices",
  ].join("\n"),
};

export const csvSamples = {
  vi: {
    a: ["ma_hang,ten,so_luong,don_gia", "SP01,Bánh quy,120,25000", "SP02,Nước mắm,40,38000", "SP03,Cà phê,15,180000", "SP04,Mì gói,300,4000"].join("\n"),
    b: ["ma_hang,ten,so_luong,don_gia", "SP01,Bánh quy,120,25000", "SP02,Nước mắm,38,38000", "SP04,Mì gói,300,4500", "SP05,Mật ong,12,150000"].join("\n"),
    nameA: "kho.csv",
    nameB: "ke_toan.csv",
  },
  en: {
    a: ["sku,name,qty,unit_price", "SP01,Cookies,120,2.50", "SP02,Fish sauce,40,3.80", "SP03,Coffee,15,18.00", "SP04,Noodles,300,0.40"].join("\n"),
    b: ["sku,name,qty,unit_price", "SP01,Cookies,120,2.50", "SP02,Fish sauce,38,3.80", "SP04,Noodles,300,0.45", "SP05,Honey,12,15.00"].join("\n"),
    nameA: "warehouse.csv",
    nameB: "accounting.csv",
  },
};
