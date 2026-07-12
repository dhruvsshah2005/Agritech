import { Request, Response, NextFunction } from "express";
import { socketService } from "../services/socket.service";
import { BroadcastAlertPayload } from "../types";

export function handleBroadcastAlert(req: Request, res: Response, next: NextFunction) {
  try {
    const { district, type, severity, title, description, actionRequired } = req.body;

    if (!district || !title || !description) {
      return res.status(400).json({ error: "district, title, and description are required" });
    }

    const payload: BroadcastAlertPayload = {
      district,
      type: type || "weather",
      severity: severity || "medium",
      title,
      description,
      actionRequired,
    };

    const broadcastedAlert = socketService.broadcastAlert(payload);
    res.status(201).json({
      message: `Emergency alert broadcasted successfully to room [district_${payload.district.toLowerCase()}]`,
      alert: broadcastedAlert,
    });
  } catch (err) {
    next(err);
  }
}

export function handleGetActiveAlerts(req: Request, res: Response, next: NextFunction) {
  try {
    const district = req.query.district as string | undefined;
    const alerts = socketService.getAlertsForDistrict(district);
    res.json({ district: district || "all", count: alerts.length, alerts });
  } catch (err) {
    next(err);
  }
}
