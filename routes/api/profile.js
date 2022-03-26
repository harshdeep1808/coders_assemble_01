const express=require('express')
const {check,validationResult}=require('express-validator')
const request=require('request')
const dotenv=require('dotenv')

dotenv.config()

const User=require('../../models/Users')
const Profile=require('../../models/Profile')
const auth=require('../../middleware/auth')

const router=express.Router()

                              //get profile
router.get('/me',auth,async(req,res)=>{ 
    try{
        const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar'])
        if(!profile){
           return res.status(404).json({msg:'No profile for this user'})
        }
        res.json(profile)
    }catch(error){
             console.log(error.message)
             res.status(500).send('Server error')
    }
    
})

                                 //create profile
    router.post('/',[auth,[
        check('status', 'Status is required').notEmpty(),
        check('skills', 'Skills is required').notEmpty(),
    ]],
    async(req,res)=>{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
        }

        const {
            company,
            location,
            bio,
            status,
            website,
            skills,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
            githubusername,
            leetcodeusername,
            codeforcesusername
          } = req.body;
               
          const profileFields={}
          
          profileFields.user=req.user.id
          if(company) profileFields.company=company
          if(website) profileFields.website=website
          if(location) profileFields.location=location
          if(bio) profileFields.bio=bio
          if(status) profileFields.status=status
          if(githubusername) profileFields.githubusername=githubusername
          if(leetcodeusername) profileFields.leetcodeusername=leetcodeusername
          if(codeforcesusername) profileFields.codeforcesusername=codeforcesusername
          if(skills){
              profileFields.skills=skills.split(',').map(skill=>skill.trim())
          }

          profileFields.social={}
          if(youtube) profileFields.social.youtube=youtube
          if(twitter) profileFields.social.twitter=twitter
          if(facebook) profileFields.social.facebook=facebook
          if(linkedin) profileFields.social.linkedin=linkedin
          if(instagram) profileFields.social.instagram=instagram
              
        
          try{
            const profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true,upsert: true, setDefaultsOnInsert: true}  // Using upsert option (creates new doc if no match is found): rest are just to avoid warnings
              );
              res.json(profile)
          }catch(error){
            console.log(error.message)
            res.status(500).send('Server error')
          }

    })
                               //GET all profiles
router.get('/',async(req,res)=>{
    try{
               const profiles=await Profile.find().populate('user',['name','avatar'])
               res.json(profiles)
    }catch(error){
        console.log(error.message)
        res.status(500).send('Server error')
    }
})
                          //GET profile by userID   
                          router.get('/user/:user_id',async(req,res)=>{
                            try{
                                       const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar'])
                                       if(!profile) return res.status(400).json({msg:'Profile not found of this user'})
                                       res.json(profile)
                            }catch(error){
                                console.log(error.message)
                                res.status(500).send('Server error')
                            }
                        })    
                        //DELETE profile
                        router.delete('/',auth,async(req,res)=>{ 
                            try{
                                await Profile.findOneAndRemove({user:req.user.id})
                                await User.findOneAndRemove({user:req.user.id})
                            
                                res.json({msg:'User removed'})
                            }catch(error){
                                     console.log(error.message)
                                     res.status(500).send('Server error')
                            }
                            
                        })  
                          
                            //UPDATE experience
                            
         router.put('/experience',[auth,[
             check('title','Title is required').not().isEmpty(),
             check('company','Company is required').not().isEmpty(),
             check('from','From date is required').not().isEmpty()
         ]],async(req,res)=>{
                const errors=validationResult(req)
                if(!errors.isEmpty()){
                    return res.status(400).send({ errors: errors.array() })
                }

                const{
                     title,company,location,from,to,current,description
                }=req.body
                 
                const newExp={title,company,location,from,to,current,description}
                try{
                      const profile=await Profile.findOne({user:req.user.id})
                      if(!profile){
                       return  res.status(500).send('Server error')
                      }
                    profile.experience.unshift(newExp)  //unshift is just like push() array method but it adds element to the beginnning
        
                    await profile.save()

                    res.json(profile)

                }catch(error){
                    console.log(error.message)
                    res.status(500).send('Server error')
                }
              
            })
                                       
                                   //DELETING experience in profile
             router.delete('/experience/:exp_id',auth,async (req,res)=>{
                         const profile=await Profile.findOne({user:req.user.id})
                         if(!profile){
                            return  res.status(500).send('Profile not found')
                           }
                    try{ 
                          const index=profile.experience.map(item=>item.id).indexOf(req.params.exp_id)
                          profile.experience.splice(index,1)
                          await profile.save()
                          res.json(profile)                 
                    }catch(error){
                        console.log(error.message)
                        res.status(500).send('Server error')
                    }
             }) 
                            
                               //PUT education in profile
             router.put('/education',[auth,[
                check('school','School is required').not().isEmpty(),
                check('degree','Degree is required').not().isEmpty(),
                check('fieldofstudy','Field of study is required').not().isEmpty(),
                check('from','From date is required').not().isEmpty()
            ]],async(req,res)=>{
                   const errors=validationResult(req)
                   if(!errors.isEmpty()){
                       return res.status(400).send({ errors: errors.array() })
                   }
   
                   const{
                        school,degree,fieldofstudy,from,to,current,description
                   }=req.body
                    
                   const newEdu={school,degree,fieldofstudy,from,to,current,description}
                   try{
                         const profile=await Profile.findOne({user:req.user.id})
                         if(!profile){
                          return  res.status(500).send('Server error')
                         }
                       profile.education.unshift(newEdu)  //unshift is just like push() array method but it adds element to the beginnning
                       
                       await profile.save()
   
                       res.json(profile)
   
                   }catch(error){
                       console.log(error.message)
                       res.status(500).send('Server error')
                   }
                 
               })
                                          
                                      //DELETING education in profile
                router.delete('/education/:edu_id',auth,async (req,res)=>{
                            const profile=await Profile.findOne({user:req.user.id})
                            if(!profile){
                               return  res.status(500).send('Profile not found')
                              }
                       try{ 
                             const index=profile.education.map(item=>item.id).indexOf(req.params.edu_id)
                             profile.experience.splice(index,1)
                             await profile.save()
                             res.json(profile)                 
                       }catch(error){
                           console.log(error.message)
                           res.status(500).send('Server error')
                       }
                })

                           //GET github repo of a user using his username from github API
         router.get('/github/:username',async(req,res)=>{
             try{
                const options={
                    uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.githubClientId}&client_secret=${process.env.githubSecret}`,
                    method:'GET',
                    headers:{'user-agent':'node-agent'} //just to avoid warning
                }
                request(options,(error,response,body)=>{
                    if(error) console.log(error)
                    if(response.statusCode!=200) res.status(400).json({msg:'no repo found'})
                    else{
                        res.json(JSON.parse(body))
                    }
                })
             }catch(error){
                console.log(error.message)
                res.status(500).send('Server error')
             }
         })    
             //GET leetcode data
         router.get('/leetcode/:username',async(req,res)=>{
            try{
               const options={
                   uri:`https://leetcode-stats-api.herokuapp.com/${req.params.username}`,
                   method:'GET',
                   headers:{'user-agent':'node-agent'} //just to avoid warning
               }
               request(options,(error,response,body)=>{
                   if(error) console.log(error)
                   if(response.statusCode!=200) res.status(400).json({msg:'no repo found'})
                   else{
                       const data=JSON.parse(body);
                       if(data.status==="error") res.status(400).json({msg:'no repo found'})
                       else
                       res.json(JSON.parse(body))
                   }
               })
            }catch(error){
               console.log(error.message)
               res.status(500).send('Server error')
            }
        })
        
            //GET codeforces data
            router.get('/codeforces/:username',async(req,res)=>{
                try{
                   const options={
                       uri:`https://competitive-coding-api.herokuapp.com/api/codeforces/${req.params.username}`,
                       method:'GET',
                       headers:{'user-agent':'node-agent'} //just to avoid warning
                   }
                   request(options,(error,response,body)=>{
                       if(error) console.log(error)
                       if(response.statusCode!=200) res.status(400).json({msg:'no repo found'})
                       else{
                           const data=JSON.parse(body);
                           if(data.status==="Failed") res.status(400).json({msg:'no repo found'})
                           else
                           res.json(JSON.parse(body))
                       }
                   })
                }catch(error){
                   console.log(error.message)
                   res.status(500).send('Server error')
                }
            })

            router.get('/likes/:user_id',async(req,res)=>{
                  try{
                        const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar','likes'])
                        if(!profile) return res.status(400).json({msg:'Profile not found of this user'})
                        res.json(profile.likes.length)
                  }catch(error){
                   console.log(error.message)
                   res.status(500).send('Server error')
                }
            })
               //add like
            router.post('/likes/:user_id',auth,async(req,res)=>{
         try{
                   const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar','likes'])
                   if(!profile) return res.status(400).json({msg:'Profile not found of this user'})
                         //check if post already liked
                if(profile.likes.filter(like=>like.user.toString()===req.user.id).length>0){
                    return res.status(404).json({ msg: 'Profile already liked' });
                }
                // adds element to beginning of array
                profile.likes.unshift({user:req.user.id})
                await profile.save()

                res.json(profile.likes)
         }catch(error){
            console.error(err.message);                  
            res.status(500).send('Server Error');
         }
          })

          //remove like
           //REMOVE a like on post
           router.post('/unlike/:user_id',auth,async (req,res)=>{
            try{
                const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar','likes'])
                   if(!profile) return res.status(400).json({msg:'Profile not found of this user'})
                            //check if post already liked
                   if(profile.likes.filter(like=>like.user.toString()===req.user.id).length===0){
                       return res.status(404).json({ msg: 'Profile not liked' });
                   }
   
                   const removeIndex=profile.likes.map(like=>like.user.toString()).indexOf(req.user.id)
                   profile.likes.splice(removeIndex,1)
                   await profile.save()
   
                   res.json(profile.likes)
            }catch(error){
               console.error(error.message);                  
               res.status(500).send('Server Error');
            }
       })   

       //add review
       router.post('/review/:user_id',[auth,
        check('text','Please enter text').not().isEmpty()
    ],async(req,res)=>{
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                res.status(400).json({errors:errors.array()})
            }
    
            try{
                   const user=await User.findById(req.user.id).select('-password')
                   const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar','likes'])
                   if(!profile) return res.status(400).json({msg:'Profile not found of this user'})
                   
                   const newReview={
                       text:req.body.text,
                       name:user.name,
                       avatar:user.avatar,
                       user:req.user.id
                   }
                profile.reviews.unshift(newReview)
                await profile.save()
                res.json(profile.reviews)
    
            } catch(error){
                console.log(error.message)
                res.status(500).send('Server error')
            }
    
    })     

           //DELETE review
           router.delete('/review/:user_id/:review_id',auth,async (req,res)=>{
            try{
                const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar','likes'])
                if(!profile) return res.status(400).json({msg:'Profile not found of this user'})
 
                 const review=profile.reviews.find(review=>review.id===req.params.review_id)
 
                 if(!review){
                    return res.status(404).json({msg:'No comment found'})
                 }
 
                 if(review.user.toString()!=req.user.id){
                     return res.status(400).json({msg:'User Not Authorized'})
                 }
                
                 const removeIndex=profile.reviews.map(review=>review.user.toString()).indexOf(req.user.id)
                 profile.reviews.splice(removeIndex,1)
                 await profile.save()
 
                 res.json(profile.reviews)
 
            }catch(error){
             console.log(error.message)
             res.status(500).send('Server error')
            }
     })

module.exports=router