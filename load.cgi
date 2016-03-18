#!/usr/bin/perl

# Nadimpally, Teja Pruthvi Varma  
#jadrn037
# CS0645, Spring 2016
# Proj1

use CGI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);

my $q = new CGI;
my $action = $q->param('action');


# Redirecting the page from Login.cgi, before loading Main page prevents 
# reload from creating new Session


##---------------------------- MAIN ---------------------------------------
#if($action eq 'main') {
    my $q = new CGI;
    my $cookie_sid = $q->cookie('jadrn037SID');
    my $session = new CGI::Session(undef, $cookie_sid, {Directory=>'/tmp'});
    my $sid = $session->id;
   print "Content-type: text/html\n\n";
    

if($cookie_sid ne $sid) {

    send_error_page();
}
else {
    send_main_page(); 

}
#}
    
###########################################################################

###########################################################################    
sub send_main_page {
    my $str ="";
    open (FILE,"</srv/www/cgi-bin/jadrn037/proj1/html_load.txt")
    or die "cannot open <html_load.txt : $!";
    
    @lines=<FILE>;
    foreach $line(@lines) {
        $str .= $line;

    }
    print $str;  
    exit;
    }
###########################################################################

###########################################################################
sub send_error_page {
    my $cookie = $q->cookie(jadrn037SID => '');
    print $q->header( -cookie=>$cookie ); #delete 
    print $q->redirect('http://jadran.sdsu.edu/~jadrn037/proj1/index.html');
    exit; # terminate the script after printing
    }
###########################################################################

###########################################################################
