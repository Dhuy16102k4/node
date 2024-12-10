const Voucher = require('../models/vouchers');

class VoucherController {

    // Add a new voucher
    async addVoucher(req, res) {
        const { code, discountType, discountValue, minOrderValue, expiryDate, usageLimit } = req.body;

        try {
            // Check if the voucher code already exists
            const existingVoucher = await Voucher.findOne({ code });
            if (existingVoucher) {
                return res.status(400).json({ message: 'Voucher code already exists' });
            }

            // Validate expiry date
            if (expiryDate && new Date(expiryDate) < new Date()) {
                return res.status(400).json({ message: 'Voucher expiry date cannot be in the past' });
            }

            // Create a new voucher
            const newVoucher = new Voucher({
                code,
                discountType,
                discountValue,
                minOrderValue,
                expiryDate,
                usageLimit
            });

            await newVoucher.save();
            res.status(201).json({ message: 'Voucher created successfully', voucher: newVoucher });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Display all vouchers
    async displayVouchers(req, res) {
        try {
            // Retrieve all vouchers
            const vouchers = await Voucher.find().sort({ createdAt: -1 });
            res.status(200).json({ message: 'Vouchers retrieved successfully', vouchers });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // Display a single voucher by code
    // static async displayVoucherByCode(req, res) {
    //     const { code } = req.params;

    //     try {
    //         // Find voucher by code
    //         const voucher = await Voucher.findOne({ code });
    //         if (!voucher) {
    //             return res.status(404).json({ message: 'Voucher not found' });
    //         }

    //         res.status(200).json({ message: 'Voucher retrieved successfully', voucher });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ message: 'Server error' });
    //     }
    // }
    // Controller (voucherController.js)
    async delete(req, res) {
        const { id } = req.params; // Lấy 'id' từ params (chính là ObjectId)

        try {
            // Tìm và xóa voucher bằng id (ObjectId)
            const deletedVoucher = await Voucher.findByIdAndDelete(id);

            if (!deletedVoucher) {
                return res.status(404).json({ message: 'Voucher not found' });
            }

            res.status(200).json({ message: 'Voucher deleted successfully', voucher: deletedVoucher });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

}

module.exports = new VoucherController();
