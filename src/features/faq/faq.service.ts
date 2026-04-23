import * as faqRepository from "./faq.repository";
import { IFAQ } from "./faq.model";

export const getAllFAQs = async () => {
  return await faqRepository.findAllFAQs();
};

export const getFAQById = async (id: string) => {
  const faq = await faqRepository.findFAQById(id);
  if (!faq) {
    throw new Error("FAQ not found");
  }
  return faq;
};

export const addFAQService = async (data: { question: string; answer: string }) => {
  return await faqRepository.createFAQ(data);
};

export const updateFAQService = async (id: string, data: Partial<{ question: string; answer: string }>) => {
  const existingFAQ = await faqRepository.findFAQById(id);
  if (!existingFAQ) {
    throw new Error("FAQ not found");
  }
  return await faqRepository.updateFAQById(id, data);
};

export const deleteFAQService = async (id: string) => {
  const faq = await faqRepository.findFAQById(id);
  if (!faq) {
    throw new Error("FAQ not found");
  }
  return await faqRepository.deleteFAQById(id);
};
