import {v2 as cloudinary} from 'cloudinary';
import { config } from './config';

   // Configuration
    cloudinary.config({ 
        cloud_name: config.cloud_name, 
        api_key: config.cloud_api, 
        api_secret: config.cloud_api_secret// Click 'View Credentials' below to copy your API secret
    });


export default cloudinary;