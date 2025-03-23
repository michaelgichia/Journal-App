/**
 * Hugging Face Inference Client Configuration
 *
 * This module initializes and exports a Hugging Face Inference client for making
 * API calls to Hugging Face's inference endpoints.
 *
 * @module hf
 */

import { InferenceClient } from '@huggingface/inference';

/**
 * The Hugging Face API key from environment variables
 * @throws {Error} If HF_API_KEY is not defined in environment variables
 */
const HF_API_KEY = process.env.HF_API_KEY;

if (!HF_API_KEY) {
  throw new Error('HF_API_KEY is not defined in environment variables');
}

/**
 * Initialized Hugging Face Inference client instance
 * Used for making API calls to Hugging Face's inference endpoints
 */
const hf = new InferenceClient(HF_API_KEY);

export default hf;