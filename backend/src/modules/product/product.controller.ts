import { Body, Controller, Get, Post, Req, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AddProductRequest, ProductDetailsWithPhotos } from './dto/product.dto';
import { LoggedInUser } from '../../common/decorator/logged-in-user.decorator';
import { LoggedIn } from '../../common/decorator/logged-in.decorator';
import { User } from '../user/dto/user.dto';
import { UserDbService } from '../../database/postgres/services/user.database.service';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService ) { }

    @Get('category')
    async getCategory() {
        return await this.productService.getCategory()
    }

    @Post('add-product')
    @UseInterceptors(FilesInterceptor('files'))
    async postProduct(@UploadedFiles() files: Express.Multer.File[], @Body('product') product: string) {
        const productInfo: AddProductRequest = JSON.parse(product) as AddProductRequest
        console.log(productInfo)
        const result = await this.productService.saveProduct({ files, product: productInfo })
        return { msg: 'success'}
    }

    @LoggedIn()
    @Get('my-products')
    async getMyProducts(@LoggedInUser() user: User): Promise<ProductDetailsWithPhotos[]>{
        const model = await this.productService.getMyProducts({ userId: user.userId})
        console.log(model)
        return model
    }
}
