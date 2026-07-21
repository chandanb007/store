const prisma = require("../config/prisma.js");


const createOrUpdatePatronTestimonials = async (data) => {
  return await prisma.testimonial.create({
    data: {
      userId: data.userId,
      message: data.message,
      rating: Number(data.rating),
      },
  });
};
const getTestimonials = async () => {
  return await prisma.testimonial.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          addresses: true,
        },
      },
    },
  });
};
const deleteTestimonials= async( id,res) => {
    return await prisma.testimonial.delete({
      where: { id: parseInt(id)},
    });

}




module.exports = {
 createOrUpdatePatronTestimonials,
 getTestimonials,
 deleteTestimonials
};