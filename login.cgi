#!/usr/bin/perl

# Nadimpally, Teja Pruthvi Varma
#jadrn037
# CS0645, Spring 2016
# Proj1

use CGI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);
use Crypt::SaltedHash;

##---------------------------- MAIN ---------------------------------------

my $q= new CGI;
#my $response;
if(authenticate_user()) {
     $response = "OK";
    send_to_main(); 
  
}
else {
    $response = "ERROR";
    send_to_login_error();
} 

   
###########################################################################

###########################################################################
sub authenticate_user {
    my $response;
    $q = new CGI;
    my $user = $q->param("user");
    my $password = $q->param("password");    
    open DATA, "</srv/www/cgi-bin/jadrn037/proj1/passwords.dat" 
        or die "Cannot open file.";
    @file_lines = <DATA>;
    close DATA;

    $OK = 0; #not authorized

    foreach $line (@file_lines) {
        chomp $line;
        ($stored_user, $stored_pass) = split /=/, $line;    
        if($stored_user eq $user && Crypt::SaltedHash->validate($stored_pass, $password)) {
            $OK = 1;
            last;
            }
        }
    return $OK;
    }
###########################################################################

###########################################################################
sub send_to_login_error {
    print $q->redirect('http://jadran.sdsu.edu/~jadrn037/proj1/error.html');
    print $response;
    exit;
    }  
    
###########################################################################
      
###########################################################################
sub send_to_main {
# args are DRIVER, CGI OBJECT, SESSION LOCATION
# default for undef is FILE, NEW SESSION, /TMP 
# for login.html, don't look for any existing session.
# Always start a new one.  Send a cookie to the browser.
# Default expiration is when the browser is closed.
# WATCH YOUR COOKIE NAMES! USE JADRNXXX_SID

    my $session = new CGI::Session(undef, undef, {Directory=>'/tmp'});
    $session->expires('+1d');
    my $cookie = $q->cookie(jadrn037SID => $session->id);
    print $q->header( -cookie=>$cookie ); #send cookie with session ID to browser   
print $response;
   # print $q->redirect('http://jadran.sdsu.edu/perl/jadrn037/proj1/direct.cgi?action=main');

    exit;
}
###########################################################################    
exit; 





