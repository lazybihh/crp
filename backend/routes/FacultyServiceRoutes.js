const express=require('express'); const FacultyService=require('../models/FacultyService'); const router=express.Router();
router.get('/',async(req,res)=>{try{res.json(await FacultyService.find().lean())}catch(e){res.status(500).json({message:'Could not load faculty services'})}});
router.get('/:key',async(req,res)=>{try{const row=await FacultyService.findOne({key:req.params.key}).lean();if(!row)return res.status(404).json({message:'Faculty service not found'});res.json(row)}catch(e){res.status(500).json({message:'Could not load faculty service'})}});
router.put('/:key',async(req,res)=>{try{const row=await FacultyService.findOneAndUpdate({key:req.params.key},{content:req.body?.content||req.body},{new:true,runValidators:true}).lean();if(!row)return res.status(404).json({message:'Faculty service not found'});res.json(row)}catch(e){res.status(400).json({message:e.message||'Could not save faculty service'})}});
module.exports=router;
