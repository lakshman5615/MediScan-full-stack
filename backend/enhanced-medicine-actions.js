// Enhanced Medicine Actions - Manual Quantity Management
// Add this route to medicine-actions.routes.js

// Manual quantity reduction when user actually takes medicine
router.post('/consume/:medicineId', authMiddleware, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { medicineId } = req.params;
    const { consumedQuantity = 1 } = req.body; // Allow custom quantity
    
    const medicine = await Medicine.findOne({ _id: medicineId, userId });
    
    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }
    
    if (medicine.quantity < consumedQuantity) {
      return res.status(400).json({ 
        success: false, 
        error: `Not enough medicine. Available: ${medicine.quantity}, Requested: ${consumedQuantity}` 
      });
    }
    
    // Reduce quantity manually
    medicine.quantity -= consumedQuantity;
    await medicine.save();
    
    // Send consumption confirmation
    await ProductionFCMService.sendNotification(
      userId,
      '✅ Medicine Consumed',
      `${medicine.medicineName} consumed (${consumedQuantity} dose). Remaining: ${medicine.quantity}`,
      { medicineId, userId }
    );
    
    // Check for low stock
    if (medicine.quantity <= 5 && medicine.quantity > 0) {
      await ProductionFCMService.sendNotification(
        userId,
        '⚠️ Low Stock Alert',
        `${medicine.medicineName} is running low. Only ${medicine.quantity} doses remaining.`,
        { medicineId, userId }
      );
    }
    
    // Out of stock alert
    if (medicine.quantity === 0) {
      await ProductionFCMService.sendNotification(
        userId,
        '🚫 Out of Stock',
        `${medicine.medicineName} is out of stock. Please refill your prescription.`,
        { medicineId, userId }
      );
    }
    
    res.json({
      success: true,
      message: 'Medicine consumption recorded',
      medicine: {
        name: medicine.medicineName,
        consumedQuantity,
        remainingQuantity: medicine.quantity,
        status: medicine.quantity === 0 ? 'Out of Stock' : 
                medicine.quantity <= 5 ? 'Low Stock' : 'Available'
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add medicine stock (when user buys more)
router.post('/restock/:medicineId', authMiddleware, async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { medicineId } = req.params;
    const { addedQuantity } = req.body;
    
    if (!addedQuantity || addedQuantity <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Added quantity must be greater than 0' 
      });
    }
    
    const medicine = await Medicine.findOne({ _id: medicineId, userId });
    
    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }
    
    // Add to existing quantity
    medicine.quantity += addedQuantity;
    await medicine.save();
    
    // Send restock confirmation
    await ProductionFCMService.sendNotification(
      userId,
      '📦 Medicine Restocked',
      `${medicine.medicineName} restocked (+${addedQuantity}). Total: ${medicine.quantity} doses`,
      { medicineId, userId }
    );
    
    res.json({
      success: true,
      message: 'Medicine restocked successfully',
      medicine: {
        name: medicine.medicineName,
        addedQuantity,
        totalQuantity: medicine.quantity,
        status: 'Restocked'
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});