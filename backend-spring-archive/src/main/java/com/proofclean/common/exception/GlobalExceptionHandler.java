package com.proofclean.common.exception;
import com.proofclean.common.dto.ErrorResponse;import org.springframework.http.*;import org.springframework.web.bind.annotation.*;import java.time.LocalDateTime;
@RestControllerAdvice
public class GlobalExceptionHandler {
 @ExceptionHandler(NotFoundException.class) ResponseEntity<ErrorResponse> notFound(RuntimeException e){return error(e,HttpStatus.NOT_FOUND);} @ExceptionHandler(BadRequestException.class) ResponseEntity<ErrorResponse> bad(RuntimeException e){return error(e,HttpStatus.BAD_REQUEST);} @ExceptionHandler(ForbiddenException.class) ResponseEntity<ErrorResponse> forbidden(RuntimeException e){return error(e,HttpStatus.FORBIDDEN);} @ExceptionHandler(UnauthorizedException.class) ResponseEntity<ErrorResponse> unauth(RuntimeException e){return error(e,HttpStatus.UNAUTHORIZED);} @ExceptionHandler(Exception.class) ResponseEntity<ErrorResponse> ex(Exception e){return error(e,HttpStatus.INTERNAL_SERVER_ERROR);} private ResponseEntity<ErrorResponse> error(Exception e,HttpStatus s){return ResponseEntity.status(s).body(new ErrorResponse(e.getMessage(),s.value(),LocalDateTime.now()));}
}
