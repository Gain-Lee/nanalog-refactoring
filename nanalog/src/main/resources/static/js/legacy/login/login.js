(function() {

    const serverUrl = 'http://localhost:8080/';

    var loginService = function() {
        this.init();
        this.run();
    };

    loginService.prototype = {
        init: function() {
            this.viewInitEventHandler();
            this.loginButtonClickEventHandler();
            this.joinButtonClickEventHandler();
            this.loginTabClickEventHandler();
            this.joinTabClickEventHandler();
        },
        viewInitEventHandler: function(){
            $('#join-btn').css('display', 'none');
            $('#login-btn').css('display', 'block');
            $('#main-template').html(memberLoginTemplate());
            typingEffectInit();
        },
        loginTabClickEventHandler: function() {
            $('#login-form-logo').click(function(e) {
                $('#member-login').css('display', 'none');
                $('#member-join').css('display', 'inline-block');
                $('#password-search').css('display', 'inline-block');
                $('#join-btn').css('display', 'none');
                $('#login-btn').css('display', 'inline-block');
                $('#main-template').html(memberLoginTemplate());
            });
        },
        joinTabClickEventHandler: function() {
            $('#member-join').click(function(e) {
                $('#member-login').css('display', 'inline-block');
                $('#member-join').css('display', 'none');
                $('#password-search').css('display', 'none');
                $('#login-btn').css('display', 'none');
                $('#join-btn').css('display', 'inline-block');
                $('#main-template').html(memberJoinTemplate());
            });
        },
        loginButtonClickEventHandler: function() {
            $('#login-btn').click(function(e) {
                let uid = document.getElementById("login-form-id").value;
                let password = document.getElementById("login-form-password").value;

                $.post(serverUrl + 'v1/user/login', {
                        uid: uid,
                        password: password
                    },
                    function(data) {
                        console.log(data);
                        if (data.uid == '' || data.uid == null) {
                            alert("로그인 실패");
                        } else {
                            alert("로그인 성공");
                            location.href = './main.html#'+data.uid;
                            /*
                             메인페이지 분기
                             */
                        }
                    }).fail(function(e){
                    alert("로그인 서버 요청 실패");
                });
            });
        },
        joinButtonClickEventHandler: function() {
            $('#join-btn').click(function(e) {
                let uid = document.getElementById("login-form-id").value;
                let password = document.getElementById("login-form-password").value;
                let nick = document.getElementById('login-form-nick').value;

                $.post(serverUrl + 'v1/user', {
                        uid: uid,
                        name: nick,
                        password: password
                    },
                    function(data) {
                        alert("회원 가입 성공");
                        $('#login-form-logo').trigger('click');
                    }).fail(function(e){
                    alert("회원 가입 실패");
                });
            });
        },
        run: function() {}
    };

    var typingEffectInit = function(){
        $("#main-intro-body").typed({
            strings: ["나날로그는 당신의 기록을 남길 수 있는 공간을 제공하는 서비스입니다."],
            typeSpeed: 150
        });
    }

    var memberLoginTemplate = function() {
        let memberLoginTemplate = '';
        memberLoginTemplate += "<div class='field'>";
        memberLoginTemplate += "<input class='login-form-component' id = 'login-form-id' type='text' name='email' placeholder='아이디'>";
        memberLoginTemplate += "</div>";
        memberLoginTemplate += "<div class='field'>";
        memberLoginTemplate += "<input class='login-form-component' id = 'login-form-password' type='password' name='password' placeholder='비밀번호'>";
        memberLoginTemplate += "</div>";
        return memberLoginTemplate;
    }

    var memberJoinTemplate = function() {
        let memberJoinTemplate = '';
        memberJoinTemplate += "<div class='field'>"
        memberJoinTemplate += "<input class='login-form-component' id = 'login-form-nick'  type='text' name='nickname' placeholder='닉네임'>";
        memberJoinTemplate += "</div>";
        memberJoinTemplate += memberLoginTemplate();
        return memberJoinTemplate;
    }

    var passwordSearchTemplate = function() {
        let passwordSearchTemplate = '';
        passwordSearchTemplate += "<div class='field'>"
        passwordSearchTemplate += "<input class='login-form-component' type='text' name='nickname' placeholder='이메일 주소'>";
        passwordSearchTemplate += "</div>";
        return passwordSearchTemplate;
    }

    var passwordSearchButtonClickEventHandler = function() {
        let email = document.getElementById('login-form-email').value;
    }

    var componentInit = function() {
        loginService = new loginService();
    };

    if (!window.componentInit) {
        window.componentInit = componentInit();
    };
})();
