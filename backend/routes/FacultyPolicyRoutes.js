const express=require('express'); const FacultyPolicy=require('../models/FacultyPolicy'); const router=express.Router();
router.get('/',async(req,res)=>{try{res.json(await FacultyPolicy.find().lean())}catch(e){res.status(500).json({message:'Could not load faculty policies'})}});
router.get('/:key',async(req,res)=>{try{const row=await FacultyPolicy.findOne({key:req.params.key}).lean();if(!row)return res.status(404).json({message:'Faculty policy not found'});res.json(row)}catch(e){res.status(500).json({message:'Could not load faculty policy'})}});
router.put('/:key',async(req,res)=>{try{const row=await FacultyPolicy.findOneAndUpdate({key:req.params.key},{content:req.body?.content||req.body},{new:true,runValidators:true}).lean();if(!row)return res.status(404).json({message:'Faculty policy not found'});res.json(row)}catch(e){res.status(400).json({message:e.message||'Could not save faculty policy'})}});
module.exports=router;
