package com.proofclean.common.util;
import java.util.UUID;
public class FileNameUtils { public static String uuidName(String original){ String ext=""; int i=original==null?-1:original.lastIndexOf('.'); if(i>=0) ext=original.substring(i).toLowerCase(); return UUID.randomUUID()+ext; } }
