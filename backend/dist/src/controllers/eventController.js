"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventController = void 0;
const eventService_1 = require("../services/eventService");
class EventController {
    eventService;
    constructor() {
        this.eventService = new eventService_1.EventService();
    }
    async createEvent(req, res) {
        try {
            const event = await this.eventService.createEvent(req.body);
            res.status(201).json(event);
        }
        catch (error) {
            res.status(500).json({ message: "Error creating event", error });
        }
    }
    async getAllEvents(req, res) {
        try {
            const events = await this.eventService.getAllEvents();
            res.status(200).json(events);
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching events", error });
        }
    }
    async getEventById(req, res) {
        try {
            const { id } = req.params;
            const event = await this.eventService.getEventById(id);
            if (!event) {
                res.status(404).json({ message: "Event not found" });
                return;
            }
            res.status(200).json(event);
        }
        catch (error) {
            res.status(500).json({ message: "Error fetching event", error });
        }
    }
    async updateEvent(req, res) {
        try {
            const { id } = req.params;
            const updatedEvent = await this.eventService.updateEvent(id, req.body);
            res.status(200).json(updatedEvent);
        }
        catch (error) {
            res.status(500).json({ message: "Error updating event", error });
        }
    }
    async deleteEvent(req, res) {
        try {
            const { id } = req.params;
            await this.eventService.deleteEvent(id);
            res.status(200).json({ message: "Event deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting event", error });
        }
    }
}
exports.EventController = EventController;
