#!/usr/bin/perl

# Nadimpally, Teja Pruthvi Varma
#jadrn037
# CS0645, Spring 2016
# Proj1

use DBI;
use CGI;

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

my $query = "SELECT sku_id, category_name, vendor_name, manufacturer_id, description, features, cost, retail, image, c.category_id, v.vendor_id FROM product p, ";
$query.= " vendor v, category c WHERE p.category_id=c.category_id AND p.vendor_id=v.vendor_id AND sku_id = '$sku'";
            
my $sth = $dbh->prepare($query);
$sth->execute();

$response .= '[';
while(my @row=$sth->fetchrow_array()) {
    $response .= '[ ';
    foreach $item (@row) {
        $item =~ s/\'/\\'/g;
        $response .= "'$item',";
    }
    $response = substr $response, 0, (length($response)-1); 
    $response .= '],';
    }   
    $response = substr $response, 0, (length($response)-1);    
    $response .= ' ]';  
     
unless($response) {
    $response = "invalid";
    }    
$sth->finish();
$dbh->disconnect();
    
print $response;              
