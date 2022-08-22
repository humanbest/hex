package kr.kro.hex;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

/**
 * Boolean 타입을 YN 문자열로 전환
 *
 * @author : Rubisco
 * @version : 1.0.0
 * @since : 2022-08-21 오후 6:52
 */

@Converter
public class BooleanToYNConverter implements AttributeConverter<Boolean, String> {

    @Override
    public String convertToDatabaseColumn(Boolean attribute) {
        return (attribute != null && attribute) ? "Y" : "N";
    }

    @Override
    public Boolean convertToEntityAttribute(String dbData) {
        return "Y".equals(dbData);
    }
}
