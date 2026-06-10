package com.proofclean.common.util;
public class ImageUtils { public static int clamp(int value, int min, int max){ return Math.max(min, Math.min(max, value)); } }
