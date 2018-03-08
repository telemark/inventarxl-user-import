-- Alle aktive brukere
SELECT o.Username, o.DisplayName, ISNULL(o.Department,'') 'Department', ISNULL(mv.ID,'') AS klasse, ISNULL(o.Street, '') 'Street', ISNULL(o.PostalCode, '') 'PostalCode', ISNULL(o.City,'') 'City', ISNULL(o.PrivateMobile,'') 'PrivateMobile', ISNULL(o.Mail,'') 'Mail', o.UserType
  FROM tblObjects o LEFT JOIN tblMultiValue mv ON o.ID = mv.StringValue
  AND mv.ID in (SELECT ID from tblObjects WHERE GroupType = 'Klassegruppe')
  AND mv.AttributeName in ('Member','owner') AND mv.ID LIKE o.Department + '%'
  WHERE o.Status = 'Active'
  AND o.Department in (SELECT id FROM tblObjects WHERE id IN (SELECT id FROM tblMultiValue WHERE AttributeName = 'Organisasjon' AND StringValue = '940192226') AND ObjectType = 'enhet')
  ORDER BY o.Lastname, o.Firstname, o.UserType

-- Personer som tilhører flere klasser
SELECT o.Username
  FROM tblObjects o INNER JOIN tblMultiValue mv ON o.ID = mv.StringValue
  AND mv.ID in (SELECT ID FROM tblObjects WHERE GroupType = 'Klassegruppe')
  AND mv.AttributeName in ('Member','owner')
  AND mv.ID LIKE o.Department + '%'
  WHERE o.Status = 'Active'
  AND o.Department in (SELECT id FROM tblObjects WHERE id IN (SELECT id FROM tblMultiValue WHERE AttributeName = 'Organisasjon' AND StringValue = '940192226') AND ObjectType = 'enhet')
  GROUP BY o.Username HAVING COUNT (o.Username) >1"ng COUNT (o.Username) >1"
