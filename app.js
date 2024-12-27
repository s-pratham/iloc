const express = require('express');
const bodyParser = require('body-parser');
// const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const path = require('path');
// const _ = require('lodash');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.set('view engine','ejs');

//mongosh "mongodb+srv://Gaurav:Gaurav07@cluster0.wpdnp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"



//mongoose.connect("mongodb+srv://Gaurav:Gaurav07@cluster0.wpdnp.mongodb.net/ilocDB?retryWrites=true&w=majority&appName=Cluster0");

require('dotenv').config();



mongoose.connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection error:', err));

// mongoose.connect("mongodb+srv://chaitanyadpitale:todolist@cluster0.gxc81.mongodb.net/todolistDB?retryWrites=true&w=majority&appName=Cluster0")


const stockAnalysisSchema = new mongoose.Schema({
	item : Number,
	total_sales : Number
});


stockAnalysisModel = mongoose.model("predictions",stockAnalysisSchema);


const adminLoginSchema = new mongoose.Schema({
	name : {            
		type : String,
		required : "Should have a name"  
	},
	password : {
		type : String,
		required : "Should have a password"
	}
});


adminLoginModel = mongoose.model("adminUser",adminLoginSchema);




const productSchema = new mongoose.Schema({
	productID : Number,
	productName : {
		type : String,
		required : "Should have name, can't be empty!!"
	},
	productPrice : {
		type : Number,
		required : "Should have a price value, can't be empty!!"
	},
	productQuantity : {
		type : Number,
		required : "Should have a quantity value, can't be empty!!"
	},

	productLocation : {
		floor: {
			type : String,
			required : "Should have name, can't be empty!!"
		}, row: {
			type : String,
			required : "Should have name, can't be empty!!"
		}, shelf: {
			type : String,
			required : "Should have name, can't be empty!!"
		}
	}
});

productModel = mongoose.model("products",productSchema);

var documentCount;
productModel.countDocuments({})
    .then((count) => {
    	documentCount = count;
        console.log("Total documents:", count);
    })
    .catch((err) => {
        console.error("Error counting documents:", err);
    });


app.get('/searchrec', async (req, res) => {
    const query = req.query.q; // Get the search term from the query string

    if (!query) {
        return res.json([]); // Return an empty array if no query is provided
    }

    try {
        // Search for products whose name contains the query string (case-insensitive)
        const results = await productModel.find(
            { productName: { $regex: query, $options: 'i' } },
            { productName: 1, _id: 0 } // Project only the productName field
        ).limit(10);

        res.json(results.map(product => product.productName)); // Return an array of product names
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post("/adminLogin",function(req,res){
	let username = req.body.username;
	let password = req.body.password;
	// const user = new adminLoginModel({
	// 	name : username,
	// 	password : password,
	// });
	
	adminLoginModel.findOne({name:username})
	  .then(userFound => {
	  		if(userFound.name===username && userFound.password===password){
	  			console.log("user found...");
	  			res.redirect('/adminHome');
	  		}else{
	  			console.log("Invalid credentials..")
	  			res.render('adminLogin',{loginsuccess:0});
	  		}
	  })
	  .catch(error => {
	    console.error('Invalid credentials...');
	    res.render('adminLogin',{loginsuccess:0});
	  });	
})

app.post('/addProductStock',function(req,res){
	let pName = req.body.productName;
	let pPrice = req.body.productPrice;
	let pQuantity  = req.body.productQuantity;
	let pFloor = req.body.productLocFloor;
	let pRow = req.body.productLocRow;
	let pShelf = req.body.productLocShelf;
	console.log(pName,pPrice,pQuantity,pFloor,pRow,pShelf);
	const newProduct = new productModel({
		productName : pName,
		productPrice : Number(pPrice),
		productQuantity : Number(pQuantity),
		productLocation : {floor:pFloor, row:pRow, shelf:pShelf},
		productID : documentCount+1
	})
	newProduct.save();
	documentCount+=1;
	res.render('addProduct',{stockAdded:1});
})


checkedproduct=[];
searchList=[];

app.post('/search',function(req,res){
	let productSearch = req.body.searchProduct;
	console.log(productSearch);
	productList=[];
	if(checkedproduct.includes(productSearch)){
		res.render('index',{searchList:searchList});
	}else{
		productModel.findOne({productName:productSearch})
		  .then(productFound => {
		  		productList.push(productFound.productName);
		  		productList.push(productFound.productLocation.floor);
		  		productList.push(productFound.productLocation.row);
		  		productList.push(productFound.productLocation.shelf); 
		  		searchList.push(productList);
		  		checkedproduct.push(productSearch);
		  		res.render('index',{searchList:searchList});
		  })
		  .catch(error => {
		    console.error('Product not Found..');
		    res.render('index',{searchList:searchList});
		  });
	}
})

app.post('/deleteSearchedProduct',function(req,res){
	let deleteSearchedProduct = req.body.checkbox;
	let deleteSearchedProductName = req.body.productName;
	searchList.splice(deleteSearchedProduct, 1);
	var index = checkedproduct.indexOf(deleteSearchedProductName);
	if (index !== -1) {
	  checkedproduct.splice(index, 1);
	}
	res.render('index',{searchList:searchList});
})

app.post('/stockSearch',function(req,res){
	let stockSearched = req.body.stockSearched;
	productModel.findOne({productName:stockSearched})
		  .then(productFound => {
		  		productList=[];
		  		productList.push(productFound.productName);
		  		productList.push(productFound.productPrice);
		  		productList.push(productFound.productQuantity);
		  		productList.push(productFound.productLocation.floor);
		  		productList.push(productFound.productLocation.row);
		  		productList.push(productFound.productLocation.shelf); 
		  		console.log(productList);
		  		console.log(stockSearched);
		  		res.render('stockSearch',{stockSearched:stockSearched,productList:productList,stockUpdated:0,stSearched:1});
		  })
		  .catch(error => {
		    console.error('Product not Found in Stock..');
		    res.redirect('/stockSearch');
		  });
})

app.post('/stockUpdate',function(req,res){
	const productName = req.body.productName;
	const productPrice = req.body.productPrice;
	const productEdited = req.body.productEdit;
	const productAdded = req.body.productAdd;
	const productFloor = req.body.productFloor;
	const productRow = req.body.productRow;
	const productShelf = req.body.productShelf;
	const stockSearched = req.body.stock;
	console.log(stockSearched);
	console.log(productName,productPrice,productEdited,productAdded,productFloor,productRow,productShelf);

	if(productName!==''){
		productModel.collection.updateOne(
		  { productName: stockSearched },
		  { $set: { productName : productName } } 
		)
		  .then(result => {
		    console.log('Update result:', result);
		  })
		  .catch(error => {
		    console.error('Error updating document:', error);
		  });
	}
	
	if(productPrice!==''){
		productModel.collection.updateOne(
	  { productName: stockSearched },
	  { $set: { productPrice : Number(productPrice)} } 
	)
	  .then(result => {
	    console.log('Update result:', result);
	  })
	  .catch(error => {
	    console.error('Error updating document:', error);
	  });
	}

	if(productEdited!==''){
		productModel.collection.updateOne(
		  { productName: stockSearched },
		  { $set: { productQuantity : Number(productEdited) } } 
		)
		  .then(result => {
		    console.log('Update result:', result);
		  })
		  .catch(error => {
		    console.error('Error updating document:', error);
		  });
	}

	if(productAdded!==''){
		productModel.collection.updateOne(
		  { productName: stockSearched },
		  { $inc: { productQuantity : Number(productAdded) } } 
		)
		  .then(result => {
		    console.log('Update result:', result);
		  })
		  .catch(error => {
		    console.error('Error updating document:', error);
		  });
	}

	if(productFloor!==''){
		productModel.collection.updateOne(
		  { productName: stockSearched },
		  { $set: { "productLocation.floor" : Number(productFloor) } } 
		)
		  .then(result => {
		    console.log('Update result:', result);
		  })
		  .catch(error => {
		    console.error('Error updating document:', error);
		  });
	}

	if(productRow!==''){
		productModel.collection.updateOne(
		  { productName: stockSearched },
		  { $set: { "productLocation.row" : Number(productRow) } } 
		)
		  .then(result => {
		    console.log('Update result:', result);
		  })
		  .catch(error => {
		    console.error('Error updating document:', error);
		  });
	}

	if(productShelf!==''){
		productModel.collection.updateOne(
		  { productName: stockSearched },
		  { $set: { "productLocation.shelf" : Number(productShelf) } } 
		)
		  .then(result => {
		    console.log('Update result:', result);
		  })
		  .catch(error => {
		    console.error('Error updating document:', error);
		  });
	}

	res.render('stockSearch',{stockSearched:" ", productList:[], stockUpdated:1,stSearched:0});
})


app.post('/stockAnalysisSearch', async function (req, res) {
    const nameOfSearchAnalysisID = req.body.stockAnalysisSearch;

    try {
        const productFound = await productModel.findOne({ productName: nameOfSearchAnalysisID });
        const productQuantity = productFound.productQuantity;
        const id = productFound.productID;

        // Call the Flask backend for predictions
        const axios = require('axios'); // Import axios for making API calls
        const flaskURL = 'http://127.0.0.1:5000/predict'; // Flask backend URL
        
        const predictionResponse = await axios.post(flaskURL, {
            item: id // Send item ID to the Flask backend
        });

        const productSalesPerMonth = Math.round(predictionResponse.data.total_sales);
        const productSalesPerDay = Math.round(productSalesPerMonth / 30);

        let Daysleft = 0;
        for (let i = 1; i < 16; i++) {
            if (productQuantity < i * productSalesPerDay) {
                break;
            }
            Daysleft++;
        }

        res.render('stockAnalysis', {
            nameOfSearchAnalysisID: nameOfSearchAnalysisID,
            stock: productQuantity,
            productSalesPerDay: productSalesPerDay,
            productSalesPerMonth: productSalesPerMonth,
            Daysleft: Daysleft,
            stSearched: 1
        });

    } catch (error) {
        console.error('Error during stock analysis:', error);
        res.redirect('stockAnalysis');
    }
});


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/adminLogin', function (req, res) {
    res.render('adminLogin', { loginsuccess: -1 });
});

app.get('/adminHome', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend', 'adminHome.html'));
});

app.post('/adminHome', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend', 'adminHome.html'));
});

app.get('/addProduct',function(req,res){
	res.render('addProduct',{stockAdded:0});
})

app.get('/stockSearch',function(req,res){
	res.render('stockSearch',{stockSearched:" ",productList:[],stockUpdated:0,stSearched:0});
})

app.get('/stockAnalysis',function(req,res){
	res.render('stockAnalysis',{stSearched:0,nameOfSearchAnalysisID:" ",total_sales:" ",
		  					stock:0,
		  					productSalesPerDay:0,
		  					productSalesPerMonth:0,
		  					Daysleft:0});
})

app.get('/about',function(req,res){
	//res.sendFile(__dirname+'/about.html');
	res.sendFile(path.join(__dirname, '../frontend/about.html'));
})


app.listen(3000,function(){
	console.log("server up and running...");
})
