







import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';


import pagination from './pagination.js';

const site ='https://vue3-course-api.hexschool.io/v2/';
const api_path = 'tomyalan978';


let productModal = {

};

let delProductModal ={

};
const app = createApp({
    data(){
        return{
            products:[],
            tempProduct:{
                imagesUrl:[]
            },
            isNew: false,
            page:{}
        };
    },
    methods:{
       getProducts(page = 1){
            const url = `${site}api/${api_path}/admin/products/?page=${page}`;
            axios.get(url).then((res) => {
                this.products = res.data.products;
                this.page = res.data.pagination;
                console.log(res.data);
            }).catch(err=> {
                console.log(err.data.message);
            })
       },
       openModal(status,product) {
        if( status === 'create'){
            productModal.show()
            this.isNew = true;
            this.tempProduct ={
                imagesUrl: [],
            };
        }else if(status === 'edit'){
            productModal.show();
            this.isNew = false;
            this.tempProduct = {...product};
        }else if(status === 'delete'){
            delProductModal.show();
            this.tempProduct = {...product}; //等等取id使用
        }
      },
       updateProduct(){
            let url = `${site}api/${api_path}/admin/product`;
            // 用this.isNew來判斷api 要怎麼運行
            let method = 'post';
            if(!this.isNew){
                url =`${site}api/${api_path}/admin/product${this.tempProduct.id}`;
                method = 'put';
            }
            axios[method](url ,{data: this.tempProduct} ).then(res => {
                this.getProducts();
                productModal.hide();
            })
       },
       deleteProduct(){
            const url = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;
            axios.delete(url).then(()=>{
                this.getProducts();
                
                delProductModal.hide();
            })
       }
    },
    components:{
        pagination,
    },
    mounted(){
        const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith('allenToken='))
        ?.split('=')[1];
      
      axios.defaults.headers.common['Authorization'] = cookieValue;
      this.getProducts();

      //boostrap 方法
      
      // bootstrap實體化
      productModal = new bootstrap.Modal('#productModal' ); 
      delProductModal = new bootstrap.Modal('#delProductModal');
    //   productModal.show();
    },
});

app.component('product-modal',{
    props:['tempProduct','updateProduct'],
    template: "#product-modal-template",
});

app.mount('#app');