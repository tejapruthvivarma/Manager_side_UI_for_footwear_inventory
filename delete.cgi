#!/usr/bin/perl

# Nadimpally, Teja Pruthvi Varma
#jadrn037
# CS0645, Spring 2016
# Proj1

use DBI;
use CGI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);


my $q = new CGI;
my $cookie_sid = $q->cookie('jadrn037SID');
my $session = new CGI::Session(undef, $cookie_sid, {Directory=>'/tmp'});
my $sid = $session->id;

if($cookie_sid ne $sid) {
	my $cookie = $q->cookie(jadrn037SID => '');
    print $q->header( -cookie=>$cookie ); #delete
    print "Error occured- <a href='http://jadran.sdsu.edu/~jadrn037/proj1/index.html'>Please Login to Continue</a>";
    exit;
}

my $host = "opatija.sdsu.edu";
my $port = "3306";
my $database = "jadrn037";
my $username = "jadrn037";
my $password = "button";
my $database_source = "dbi:mysql:$database:$host:$port";
my $response = "";
my $sku;
print "Content-type: text/html\n\n";

my $dbh = DBI->connect($database_source, $username, $password)
or die 'Cannot connect to db';

my $q = new CGI;
foreach $key ($q->param) {

if ($key =~ /sku/) {
	   $sku = $q->param($key);	
	}
}

my $query = "DELETE FROM product WHERE sku_id = '$sku'";
            
my $sth = $dbh->prepare($query);
$sth->execute(); 

print "Stock unit ".$sku." is removed sucessfully";

$sth->finish();
$dbh->disconnect();
             