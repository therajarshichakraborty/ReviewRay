import Razorpay from "razorpay";


let razorpay: Razorpay | null = null;


export function getRazorpay(){
    if(!razorpay){
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_TEST_API_KEY!,
            key_secret: process.env.RAZORPAY_TEST_KEY_SECRET!,
        })
    }

    return razorpay;
}