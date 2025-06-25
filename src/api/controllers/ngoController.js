import Ngo from "../../models/NgoModel.js"


export const createNgo = async (req, res) => {
    const {
     userId,
      name,
      about,
      headOfOrganization,
      address,
      website,
      instagramUrl,
      facebookUrl,
      xurl,
      youtubeUrl,
      linkedInUrl,
      gov,
      awards, // Expected as JSON string or array
      journey, // Expected as JSON string or object
      bloodCategory,
    } = req.body;
  
    try {
        const backGroundImage = req.files?.backGroundImage ? req.files?.backGroundImage[0].key: null;
        const image = req.files?.image ? req.files?.image[0].key : null
        const journeyImage = req.files?.journeyImage ? req.files?.journeyImage[0].key : null;
      
        // Handle awards images (if awards is an array)
        let parsedAwards = [];
        if (awards) {
              parsedAwards = typeof awards === "string" ? JSON.parse(awards) : awards;
              parsedAwards = parsedAwards.map((award, index) => {
                const fieldName = `awards[${index}][image]`;
                return {
                  ...award,
                  image: req.files[fieldName]
                    ? req.files[fieldName][0].key
                    : award.image || null,
                };
              });

          }
        
        let parsedBloodCategory = [];
    if (bloodCategory) {
        parsedBloodCategory = typeof bloodCategory === "string" ? JSON.parse(bloodCategory) : bloodCategory;

        // Validate bloodCategory against enum
        const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        const invalidBloodTypes = parsedBloodCategory.filter(
          (type) => !validBloodTypes.includes(type)
        );
        if (invalidBloodTypes.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Invalid blood types: ${invalidBloodTypes.join(", ")}. Must be one of ${validBloodTypes.join(", ")}`,
          });
        }

    }
        
      
        // Parse journey if it's a string
        const parsedJourney = typeof journey === "string" ? JSON.parse(journey) : journey;
      
        // Create new NGO
        const ngo = await Ngo.create({
          userId,
          name,
          backGroundImage,
          image,
          about,
          headOfOrganization,
          address,
          website,
          instagramUrl,
          facebookUrl,
          xurl,
          youtubeUrl,
          linkedInUrl,
          gov: gov === "true" || gov === true, // Handle string or boolean input
          awards: parsedAwards,
          journey: {
            ...parsedJourney,
            image: journeyImage || parsedJourney?.image,
          },
          bloodCategory:parsedBloodCategory
        });
    
        return res.status(201).json({
            success:true,
            message:"Ngo Created Successfully",
            data:ngo
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
 
    
  };
  