const emailJS=require('emailjs-com')

const service_id=process.env.SERVICE_ID;
const template_id=process.env.TEMPLATE_ID;


function sendEmail(templateParams){
    return new Promise((resolve,reject)=>{
        emailJS.send(service_id,template_id,templateParams,(error,result)=>{
            if(error){
                console.log(error);
                return reject(error);
            }
            console.log('mail sent');

            return resolve(result);
        })
    })
}

module.exports=sendEmail;