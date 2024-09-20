package com.challet.challetservice.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {
    NOT_FOUND_USER_EXCEPTION(400, "NotFoundUserException", "유저가 존재하지 않습니다."),
    NOT_FOUND_CHALLENGE_EXCEPTION(400, "NotFoundChallengeException","챌린지가 존재하지 않습니다."),
    USER_ALREADY_EXISTS_EXCEPTION(400, "UserAlreadyExists","이미 가입된 유저입니다."),
    CODE_MISMATCH_EXCEPTION(400, "CodeMismatchException", "초대코드가 일치하지 않습니다."),

    PASSWORD_MISMATCH_EXCEPTION(401, "PasswordMismatchException", "비밀번호가 일치하지 않습니다."),
    INVALID_TOKEN_EXCEPTION(401, "InvalidTokenException","유효하지 않은 토큰입니다."),
    ALREADY_JOIN_EXCEPTION(403, "AlreadyJoinException","이미 참여중인 챌린지 입니다." ),
    NOT_RECRUITING_EXCEPTION(403, "NotRecruitingException", "모집이 끝난 챌린지 입니다."),
    NOT_FOUND_REFRESH_TOKEN_EXCEPTION(401, "NotFoundRefreshTokenException","리프레시 토큰이 없습니다." ),
    MAX_PARTICIPANTS_EXCEEDED_EXCEPTION(403, "MaxParticipantsExceededException", "이미 다 찬 챌린지 입니다.");

    private int statusNumber;
    private String errorCode;
    private String errorMessage;
}