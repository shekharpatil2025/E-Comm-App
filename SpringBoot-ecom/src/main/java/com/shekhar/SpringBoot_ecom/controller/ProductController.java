package com.shekhar.SpringBoot_ecom.controller;

import com.shekhar.SpringBoot_ecom.model.DTO.PageResponse;
import com.shekhar.SpringBoot_ecom.model.Product;
import com.shekhar.SpringBoot_ecom.service.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
@Tag(name = "Products", description = "Product management — CRUD operations")
public class ProductController{

    @Autowired
    private ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts(){
        return new ResponseEntity<> (productService.getAllProducts(), HttpStatus.OK);
    }
    @GetMapping("/products/paged")
    public ResponseEntity<PageResponse<Product>> getProductsPaginated(
            @RequestParam(defaultValue = "0")   int page,
            @RequestParam(defaultValue = "10")  int size,
            @RequestParam(defaultValue = "id")  String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false)     String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false)     BigDecimal maxPrice
    ) {
        PageResponse<Product> response = productService.getProductsPaginated(
                page, size, sortBy, direction, category, minPrice, maxPrice
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id) {
        Product product = productService.getProductById(id);
        if (product.getId() > 0) {
            return new ResponseEntity<>(product, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PostMapping("/product")
    public ResponseEntity<?> createProduct(@RequestPart Product product,@RequestPart MultipartFile imageFile) throws IOException {
        Product product1= null;
        try {
            product1 = productService.addOrUpdateProduct(product,imageFile);
            return new ResponseEntity<>(product1,HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/product/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable int id) {
        Product product = productService.getProductById(id);
        byte[] image = product.getImageData();
        return new ResponseEntity<>(image,HttpStatus.OK);
    }

    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable int id,@RequestPart Product product,@RequestPart(required = false) MultipartFile imageFile) throws IOException {

        Product productupdate= null;
        try {
            productupdate = productService.addOrUpdateProduct(product,imageFile);
            return new ResponseEntity<>("updated",HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            productService.deleteProduct(id);
            return new ResponseEntity<>("Deleted", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Not Found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> getProductsByName(@RequestParam String keyword){
        List<Product> product=productService.SearchProduct(keyword);
        System.out.println("searching for "+ keyword);
        return new ResponseEntity<>(product,HttpStatus.OK);
    }
}


