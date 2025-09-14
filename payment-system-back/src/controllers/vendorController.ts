import { Request, Response } from "express";
import { VendorModel } from '../models/Vendor';
import { AuthRequest } from '../types';

export const createVendor = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, contactInfo, bankAccountNo, bankName, taxId } = req.body;

    const vendor = await VendorModel.create({
      name,
      email,
      contact_info: contactInfo,
      bank_account_no: bankAccountNo,
      bank_name: bankName,
      tax_id: taxId
    });

    res.status(201).json({ 
      message: 'Vendor created successfully',
      vendor
    });
  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVendors = async (req: AuthRequest, res: Response) => {
  try {
    const vendors = await VendorModel.findAll();
    res.json({ vendors });
  } catch (error) {
    console.error('Get vendors error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateVendor = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, contactInfo, bankAccountNo, bankName, taxId } = req.body;

    const vendor = await VendorModel.update(id, {
      name,
      email,
      contact_info: contactInfo,
      bank_account_no: bankAccountNo,
      bank_name: bankName,
      tax_id: taxId
    });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ 
      message: 'Vendor updated successfully',
      vendor
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteVendor = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    await VendorModel.delete(id);
    
    res.json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    console.error('Delete vendor error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};