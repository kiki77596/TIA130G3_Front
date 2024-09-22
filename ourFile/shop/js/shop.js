export function valueEncryption(value,key) { 
    return CryptoJS.AES.encrypt(value,key).toString();
}
export function valueDecryption(value, key) {
    return CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8)
}
export function getProducts() {
    return fetch('http://localhost:8081/shoppingCart-server/getProducts', {
        method: 'get',
        mode: 'cors'
    })
    .then(response => response.json())
    .catch(error => {
        console.error('获取数据时出错:', error);
        throw error; // 重新抛出错误以便在外部处理
    });
};
export function addTocart(item,qty,type) { 
    if (!localStorage.getItem('cart'))
        localStorage.setItem('cart',JSON.stringify([]));
    
    const prod = {
        id:item.id,
        name: item.name,
        price: item.price,
        imgs: [],
        qty: qty
    };

    if (item.imgs.length != 0 && item.imgs[0]!==null)
        prod.imgs = item.imgs[0];
    else
        prod.imgs = [];
    let cart = [];
    cart = JSON.parse(localStorage.getItem('cart'));

    if (type === 1) {
        if (!cart.find(o => o.id === prod.id)) {
            cart.push(prod)
        }
        else { 
            cart.find(o => o.id === prod.id).qty +=prod.qty;
        }     
    } else {
        cart.find(o => o.id === prod.id).qty--;
    }
    localStorage.setItem('cart', JSON.stringify(cart));

}
export function removeFromcart(item)
{
    let cart = [];
    cart = JSON.parse(localStorage.getItem('cart'));

    cart = cart.filter(function (obj) {
        return obj.id !== item.id;
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
}
export function cartUpdate(item,type) {
    
    switch (type) {
        case "Increase":
            item.qty < 99 ? item.qty++ : 99;
            break;
        case "Decrease":
            item.qty > 1 ? item.qty-- : 1;
            break;
        default:
            break;
    }


}
export function getPublickey(type) { 
    return CryptoJS.SHA256(type).toString();
}
export function prodKeys() {
    return {
    id: "qjoio1ojop151665q6qg.",
    name: "opjeoi1_??2k1p@g",
    price: "opgjewop@[@[g",
    imgs:"qwe4qw6547g98q87fq"
    }
}