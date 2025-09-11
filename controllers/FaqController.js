import FAQ from "../models/FAQ.js"; 

// 👉 Create FAQ
export const addFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    const faq = new FAQ({ question, answer });
    await faq.save();

    res.status(201).json({ message: "FAQ created successfully", faq });
  } catch (error) {
    res.status(500).json({ message: "Error creating FAQ", error: error.message });
  }
};

// 👉 Get All FAQs
export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching FAQs", error: error.message });
  }
};

// 👉 Get Single FAQ
export const getFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: "Error fetching FAQ", error: error.message });
  }
};

// 👉 Update FAQ
export const updateFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;

    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { question, answer },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json({ message: "FAQ updated successfully", faq });
  } catch (error) {
    res.status(500).json({ message: "Error updating FAQ", error: error.message });
  }
};

// 👉 Delete FAQ
export const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting FAQ", error: error.message });
  }
};
