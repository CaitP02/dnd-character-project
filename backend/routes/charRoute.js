import express from "express";
import {charSheet} from "../models/charModel.js";    

const router = express.Router();
 
 
router.post('/', async (request, response) => {
   try {
     if (
       !request.body.name ||
       !request.body.raceType ||
       !request.body.classType ||
       !request.body.level ||
       !request.body.abilityScores
     ) {
       return response.status(400).send("All fields are required");
     }
  const newChar = {
   name: request.body.name,
   raceType: request.body.raceType,
   classType: request.body.classType,
   level: request.body.level,
   proficiencyBonus: request.body.proficiencyBonus,
   healthPoints: request.body.healthPoints,
   speed: request.body.speed,
   armourClass: request.body.armourClass,
   alignment: request.body.alignment,
   background: request.body.background,
   languages: request.body.languages,
   abilityScores: request.body.abilityScores,
   skillScores: request.body.skillScores
  };
     const char = await charSheet.create(newChar);
     response.status(201).send(char);
   } catch (error) {
     response.status(400).send(error);
   }
 });

router.get('/', async (request, response) => {
   try {
     const char = await charSheet.find();
     response.status(200).send({
       count: char.length,
       data: char
     });
   } catch (error) {
     response.status(400).send(error);
   }
 });

router.get('/:id', async (request, response) => {
   try {
     const {id} = request.params;
     const char = await charSheet.findById(id);
     response.status(200).json(char);

   } catch (error) {
     response.status(400).send(error);
   }
 });

router.put('/:id', async (request, response) => {
   try {
     const {id} = request.params;
     const updatedChar = await charSheet.findByIdAndUpdate(id, request.body, {new: true});
     response.status(200).json(updatedChar);
   } catch (error) {
     response.status(400).send(error);
   }
 });

router.delete('/:id', async (request, response) => {
   try {
     const {id} = request.params;
     await charSheet.findByIdAndDelete(id);
     response.status(204).send();
   } catch (error) {
     response.status(400).send(error);
   }
 });

 export default router;